/* eslint-disable import/no-extraneous-dependencies */
import { createConnection, Connection } from 'typeorm';
import request from 'supertest';
import { addDays } from 'date-fns';
import app from '../../../app';
import Veiculo from '../entities/Veiculo';
import ECombustivel from '../enums/ECombustivel';
import SituacaoVeiculo from '../entities/SituacaoVeiculo';
import { EOrigemDeAquisicao } from '../enums/EAquisicao';
import { EPrefixoTipo, EEmprego } from '../enums/EPrefixo';

function makeString(length: number): string {
  const result = [];
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.split(
    '',
  );
  for (let i = 0; i < length; i += 1) {
    result.push(characters[Math.floor(Math.random() * characters.length)]);
  }
  return result.join('');
}

function makeStringNumber(length: number): string {
  const result = [];
  const characters = '0123456789'.split('');
  for (let i = 0; i < length; i += 1) {
    result.push(characters[Math.floor(Math.random() * characters.length)]);
  }
  return result.join('');
}

function getRandomEnum(input: object): any {
  const inputTransform: { [key: string]: string } = input as {
    [key: string]: string;
  };
  const keysToArray = Object.keys(inputTransform);
  const valuesToArray = keysToArray.map(key => inputTransform[key]);
  if (!Number.isNaN(parseInt(keysToArray[0], 10))) {
    const len = keysToArray.length;
    while (keysToArray.length !== len / 2) {
      keysToArray.shift();
      valuesToArray.shift();
    }
  }
  const randIndex = Math.floor(keysToArray.length * Math.random());
  return valuesToArray[randIndex];
}

describe.skip('Route Test for veiculos situacoes', () => {
  let connection: Connection | null = null;
  let token: string;
  let veiculo: Veiculo;

  beforeAll(async (done: any) => {
    connection = await createConnection();
    const responseLogin = await request(app).post('/sessions').send({
      matricula: '30891368',
      senha: 'Chicojj123',
    });

    token = responseLogin.body.token; // save the token!

    const veiculoResponse = await request(app)
      .post('/veiculos')
      .send({
        body: {
          aquisicao: {
            data_aquisicao: '2020-12-31',
            origem_aquisicao: EOrigemDeAquisicao.CESSAO,
            id_orgao_aquisicao: 3,
          },
          identificador: {
            data_identificador: '2020-2-21',
            identificador: makeString(6),
          },
          prefixo: {
            prefixo_tipo: EPrefixoTipo['21 - ADM'],
            emprego: EEmprego['Não Consta'],
            prefixo_sequencia: makeString(5),
          },
          km: 25,
          id_veiculo_especie: 1,
          id_marca: 1,
          id_modelo: 4,
          id_cor: 4,
          uf: 2,
          ano_modelo: '2020',
          ano_fabricacao: '2022',
          codigo_seguranca_crv: makeStringNumber(11),
          combustivel: getRandomEnum(ECombustivel),
          valor_fipe: Number.parseInt(makeStringNumber(4), 10),
          chassi: makeString(18),
          renavam: makeStringNumber(11),
          orgao_tombo: 1,
          numero_crv: makeStringNumber(10),
          referenciasPneus: [{ id_pneu: 1 }],
        },
      })
      .set({
        'Content-Type': 'application/json',
      })
      .set('Authorization', `Bearer ${token}`);

    veiculo = veiculoResponse.body;
    done();
  });

  afterAll(async () => {
    if (connection) {
      await connection?.manager.remove(Veiculo);

      await connection?.close();
    }
  });

  test('should return 400 if veiculo not exists', async () => {
    const result = await request(app)
      .post('/veiculos/372/situacoes')
      .send({
        body: {
          observacao: 'teste',
          id_situacao_tipo: Math.floor(Math.random() * (6 - 2) + 2),
          data_situacao: new Date('2021-03-06T03:00:00.000Z'),
          km: 12,
        },
      })
      .set({
        'Content-Type': 'application/json',
      })
      .set('Authorization', `Bearer ${token}`);

    expect(result.statusCode).toBe(400);

    expect(result.body).toMatchObject({
      message: 'Veiculo não encontrado',
    });
  });

  test.skip('should return 400 if id_situacao_tipo already exists', async () => {
    const result = await request(app)
      .post(`/veiculos/${veiculo.id_veiculo}/situacoes`)
      .send({
        body: {
          observacao: 'teste',
          id_situacao_tipo: 1,
          data_situacao: new Date('2021-03-06T03:00:00.000Z'),
          km: 12,
        },
      })
      .set({
        'Content-Type': 'application/json',
      })
      .set('Authorization', `Bearer ${token}`);

    expect(result.statusCode).toBe(400);

    expect(result.body).toMatchObject({
      message: 'Situacao de veiculo ja existente',
    });
  });

  test('should return 400 if provided km is lower than the actual km and data_situacao is higher than situacao exists', async () => {
    const result = await request(app)
      .post(`/veiculos/${veiculo.id_veiculo}/situacoes`)
      .send({
        body: {
          observacao: 'teste',
          id_situacao_tipo: 1,
          data_situacao: new Date(),
          km: 0,
        },
      })
      .set({
        'Content-Type': 'application/json',
      })
      .set('Authorization', `Bearer ${token}`);

    expect(result.statusCode).toBe(400);
  });

  test('should return 201 if could create situacao', async (done: any) => {
    const body = {
      observacao: 'teste',
      id_situacao_tipo: Math.floor(Math.random() * (6 - 2) + 2),
      data_situacao: new Date('2021-03-06T03:00:00.000Z'),
      km: 17,
    };

    const result = await request(app)
      .post(`/veiculos/${veiculo.id_veiculo}/situacoes`)
      .send({ body })
      .set({
        'Content-Type': 'application/json',
      })
      .set('Authorization', `Bearer ${token}`);

    expect(result.statusCode).toBe(201);

    done();
  });

  test('should return 201 if provided km is lower than the actual km and data_situacao is higher than situacao exists', async () => {
    const result = await request(app)
      .post(`/veiculos/${veiculo.id_veiculo}/situacoes`)
      .send({
        body: {
          observacao: 'teste',
          id_situacao_tipo: 1,
          data_situacao: new Date('2021-03-05T03:00:00.000Z'),
          km: 15,
        },
      })
      .set({
        'Content-Type': 'application/json',
      })
      .set('Authorization', `Bearer ${token}`);

    expect(result.statusCode).toBe(201);
  });

  test.skip('should 200 when found situacoes for given veiculo', async () => {
    const situacoesResponse = [
      {
        id_situacao: 119,
        nome: 'Operando',
        observacao: 'Criacao ',
        criado_em: '2021-05-10T01:54:46.098Z',
        data_situacao: '2021-05-09',
        km: 0,
      },
      {
        id_situacao: 120,
        nome: 'Inservível',
        observacao: null,
        criado_em: '2021-05-10T15:59:58.914Z',
        data_situacao: '2021-05-10',
        km: 1,
      },
      {
        id_situacao: 121,
        nome: 'Baixada',
        motivo: 'Manutenção',
        observacao: null,
        criado_em: '2021-05-10T16:03:50.268Z',
        data_situacao: '2021-05-10',
        km: 2,
      },
      {
        id_situacao: 122,
        nome: 'Baixada',
        motivo: 'Falta de combustível',
        observacao: null,
        criado_em: '2021-05-10T16:11:34.010Z',
        data_situacao: '2021-05-10',
        km: 5,
      },
      {
        id_situacao: 123,
        nome: 'Baixada',
        motivo: 'Em tramitação de combustível',
        observacao: null,
        criado_em: '2021-05-10T16:12:39.298Z',
        data_situacao: '2021-05-10',
        km: 5,
      },
      {
        id_situacao: 155,
        nome: 'Operando',
        observacao: null,
        criado_em: '2021-05-10T17:47:38.611Z',
        data_situacao: '2021-05-10',
        km: 7,
      },
      {
        id_situacao: 156,
        nome: 'Baixada',
        motivo: 'Manutenção',
        observacao: null,
        criado_em: '2021-05-10T17:52:13.275Z',
        data_situacao: '2021-05-10',
        km: 7,
      },
      {
        id_situacao: 157,
        nome: 'Baixada',
        motivo: 'Falta de combustível',
        observacao: null,
        criado_em: '2021-05-10T17:54:31.331Z',
        data_situacao: '2021-05-10',
        km: 7,
      },
    ];

    const response = await request(app)
      .get('/veiculos/106/situacoes')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({
      situacoes: situacoesResponse,
    });
  });

  test('should return 201 when can create km and km and is not reset', async () => {
    const body = {
      observacao: 'teste',
      id_situacao_tipo: Math.floor(Math.random() * (6 - 2) + 2),
      data_situacao: addDays(new Date(), 1),
      km: 30,
    };

    const result = await request(app)
      .post(`/veiculos/${veiculo.id_veiculo}/situacoes`)
      .send({ body })
      .set({
        'Content-Type': 'application/json',
      })
      .set('Authorization', `Bearer ${token}`);

    expect(result.statusCode).toBe(201);
  });

  test('should return 201 when create situacao and km is not reseted and not change situacao veiculo', async () => {
    const body = {
      observacao: 'teste',
      id_situacao_tipo: Math.floor(Math.random() * (6 - 2) + 2),
      data_situacao: new Date('2021-03-07T03:00:00.000Z'),
      km: 19,
    };
    const result = await request(app)
      .post(`/veiculos/${veiculo.id_veiculo}/situacoes`)
      .send({ body })
      .set({
        'Content-Type': 'application/json',
      })
      .set('Authorization', `Bearer ${token}`);

    expect(result.statusCode).toBe(201);
  });
});
