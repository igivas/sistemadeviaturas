/* eslint-disable import/no-extraneous-dependencies */
import { createConnection, Connection } from 'typeorm';
import request from 'supertest';
import { EPrefixoTipo, EEmprego } from '@modules/veiculos/enums/EPrefixo';
import Veiculo from '@modules/veiculos/entities/Veiculo';
import ECombustivel from '@modules/veiculos/enums/ECombustivel';
import { EOrigemDeAquisicao } from '@modules/veiculos/enums/EAquisicao';
import app from '../../../app';

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

describe.skip('Route Test Exemple', () => {
  let connection: Connection | null = null;
  let token: string;

  const codigo_seguranca_crv = makeStringNumber(11);
  const placa = 'poi1311';
  const chassi = makeString(18);
  const renavam = makeStringNumber(11);
  const numero_crv = makeStringNumber(10);

  const veiculo = {
    id_veiculo_especie: 1,
    id_marca: 1,
    id_modelo: 4,
    id_cor: 4,
    uf: 2,
    ano_modelo: 2020,
    ano_fabricacao: 2022,
    combustivel: getRandomEnum(ECombustivel),
    valor_fipe: makeStringNumber(4),
    referenciasPneus: [{ id_pneu: 4 }, { id_pneu: 4 }],
    orgao_tombo: 1,
  };

  const aquisicao = {
    origem_aquisicao: EOrigemDeAquisicao.LOCADO,
    data_aquisicao: '2020-12-31',
  };

  const identificador = {
    data_identificador: '2020-2-21',
    identificador: makeString(6),
  };

  beforeAll(async (done: any) => {
    connection = await createConnection();
    const response = await request(app).post('/sessions').send({
      matricula: '30891368',
      senha: 'Chicojj123',
    });

    token = response.body.token; // save the token!
    done();
  });

  afterAll(async () => {
    await connection?.manager.remove(Veiculo);
    await connection?.close();
  });

  test('should return 400 if numero_crv already exists', async (done: any) => {
    const veiculoNumeroCRV = connection?.manager.create(Veiculo, {
      numero_crv,
    });

    await connection?.manager.save(Veiculo, veiculoNumeroCRV as Veiculo);

    const body = {
      aquisicao,
      identificador,
      ...veiculo,

      chassi,
      numero_crv,
      codigo_seguranca_crv,
    };

    const result = await request(app)
      .post('/veiculos')
      .send({ body })
      .set({
        'Content-Type': 'application/json',
      })
      .set('Authorization', `Bearer ${token}`);

    expect(result.statusCode).toBe(400);
    expect(result.body).toMatchObject({
      message: `Um veiculo ja possui algum este(s) campo(s) ${[
        chassi,
        numero_crv,
        codigo_seguranca_crv,
      ].join(',')}`,
    });
    done();
  });

  test('should return 400 if renavam already exists', async (done: any) => {
    const veiculoRenavam = connection?.manager.create(Veiculo, {
      renavam,
    });

    await connection?.manager.save(Veiculo, veiculoRenavam as Veiculo);

    const result = await request(app)
      .post('/veiculos')
      .send({
        body: {
          aquisicao,
          identificador,
          ...veiculo,
          chassi,
          codigo_seguranca_crv,
          renavam,
          numero_crv,
        },
      })
      .set({
        'Content-Type': 'application/json',
      })
      .set('Authorization', `Bearer ${token}`);

    expect(result.statusCode).toBe(400);
    expect(result.body).toMatchObject({
      message: `Um veiculo ja possui algum este(s) campo(s) ${[
        chassi,
        numero_crv,
        renavam,
        codigo_seguranca_crv,
      ].join(',')}`,
    });
    done();
  });

  test('should return 400 if placa already exists', async (done: any) => {
    const veiculoPlaca = connection?.manager.create(Veiculo, {
      placa,
    });

    await connection?.manager.save(Veiculo, veiculoPlaca as Veiculo);

    const result = await request(app)
      .post('/veiculos')
      .send({
        body: {
          aquisicao,
          identificador,
          ...veiculo,
          chassi,
          codigo_seguranca_crv,
          numero_crv,
          placa,
        },
      })
      .set({
        'Content-Type': 'application/json',
      })
      .set('Authorization', `Bearer ${token}`);

    expect(result.statusCode).toBe(400);
    expect(result.body).toMatchObject({
      message: `Um veiculo ja possui algum este(s) campo(s) ${[
        chassi,
        numero_crv,
        placa,
        codigo_seguranca_crv,
      ].join(',')}`,
    });
    done();
  });

  test('should return 400 if chassi already exists', async (done: any) => {
    const veiculoChassi = connection?.manager.create(Veiculo, {
      chassi,
    });

    await connection?.manager.save(Veiculo, veiculoChassi as Veiculo);

    const result = await request(app)
      .post('/veiculos')
      .send({
        body: {
          aquisicao,
          identificador,
          chassi,
          numero_crv,
          codigo_seguranca_crv,
          ...veiculo,
        },
      })
      .set({
        'Content-Type': 'application/json',
      })
      .set('Authorization', `Bearer ${token}`);

    expect(result.statusCode).toBe(400);
    expect(result.body).toMatchObject({
      message: `Um veiculo ja possui algum este(s) campo(s) ${[
        chassi,
        numero_crv,
        codigo_seguranca_crv,
      ].join(',')}`,
    });
    done();
  });

  test('should return 400 if codigo_seguranca_crv already exists', async (done: any) => {
    const veiculoCodigoCRV = connection?.manager.create(Veiculo, {
      codigo_seguranca_crv,
    });

    await connection?.manager.save(Veiculo, veiculoCodigoCRV as Veiculo);

    const result = await request(app)
      .post('/veiculos')
      .send({
        body: {
          aquisicao,
          identificador,
          chassi,
          numero_crv,
          codigo_seguranca_crv,
          ...veiculo,
        },
      })
      .set({
        'Content-Type': 'application/json',
      })
      .set('Authorization', `Bearer ${token}`);

    expect(result.statusCode).toBe(400);
    expect(result.body).toMatchObject({
      message: `Um veiculo ja possui algum este(s) campo(s) ${[
        chassi,
        numero_crv,
        codigo_seguranca_crv,
      ].join(',')}`,
    });
    done();
  });

  test('should return 400 if km is invalid acording to uni tests', async () => {
    const response = await request(app)
      .post('/veiculos')
      .send({
        body: {
          aquisicao,
          identificador: {
            ...identificador,
            identificador: makeString(5),
          },
          numero_crv: makeStringNumber(10),
          codigo_seguranca_crv: makeStringNumber(10),
          ...veiculo,
          chassi: makeString(18),
          km: -1,
        },
      })
      .set({
        'Content-Type': 'application/json',
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(400);
    expect(response.body).toMatchObject({
      message: 'Validation fails',
      errors: {
        km: ['O km não pode ser negativo'],
      },
    });
  });

  test('should create veiculo locado without referenciaPneu', async (done: any) => {
    const result = await request(app)
      .post('/veiculos')
      .send({
        body: {
          aquisicao,
          identificador: {
            ...identificador,
            identificador: makeString(5),
          },
          numero_crv: makeStringNumber(10),
          codigo_seguranca_crv: makeStringNumber(10),
          ...veiculo,
          chassi: makeString(18),
        },
      })
      .set({
        'Content-Type': 'application/json',
      })
      .set('Authorization', `Bearer ${token}`);

    expect(result.statusCode).toBe(201);

    done();
  });

  test('should return 400 when aquisicao.origem_aquisicao is Cessão and other required fields is not set', async (done: any) => {
    const newAquisicao = {
      ...aquisicao,
      origem_aquisicao: EOrigemDeAquisicao.ORGANICO,
      id_orgao_aquisicao: 3,
    };

    const newIdentificador = {
      ...identificador,
      identificador: makeString(5),
    };

    const result = await request(app)
      .post('/veiculos')
      .send({
        body: {
          aquisicao: newAquisicao,
          identificador: newIdentificador,
          ...veiculo,
          chassi: makeString(18),
        },
      })
      .set({
        'Content-Type': 'application/json',
      })
      .set('Authorization', `Bearer ${token}`);

    expect(result.statusCode).toBe(400);
    expect(result.body.errors).toMatchObject({
      'prefixo.prefixo_tipo': ['Campo PREFIXO TIPO é requerido'],
      'prefixo.prefixo_sequencia': ['Campo PREFIXO SEQUENCIA é requerido'],
      'prefixo.emprego': ['Campo EMPREGO é requerido'],
      numero_crv: ['Campo NUMERO CRV é requerido'],
      codigo_seguranca_crv: ['Campo CÓDIGO SEGURANÇA CRV é requerido'],
    });

    done();
  });

  test('should return 201 when aquisicao.origem_aquisicao is Cessão and other required fields are set', async (done: any) => {
    const newAquisicao = {
      ...aquisicao,
      origem_aquisicao: EOrigemDeAquisicao.CESSAO,
      id_orgao_aquisicao: 3,
    };

    const newIdentificador = {
      ...identificador,
      identificador: makeString(5),
    };

    const result = await request(app)
      .post('/veiculos')
      .send({
        body: {
          aquisicao: newAquisicao,
          identificador: newIdentificador,
          ...veiculo,
          chassi: makeString(18),
          numero_crv: makeStringNumber(10),
          codigo_seguranca_crv: makeStringNumber(11),
          prefixo: {
            prefixo_tipo: EPrefixoTipo['21 - ADM'],
            emprego: EEmprego['Não Consta'],
            prefixo_sequencia: makeString(5),
          },
          km: 2,
        },
      })
      .set({
        'Content-Type': 'application/json',
      })
      .set('Authorization', `Bearer ${token}`);

    expect(result.statusCode).toBe(201);

    done();
  });

  test('should return 201 when aquisicao.origem_aquisicao is Cessão and other required fields are set', async (done: any) => {
    const result = await request(app)
      .post('/veiculos')
      .send({
        body: {
          aquisicao: {
            origem_aquisicao: EOrigemDeAquisicao.CESSAO,
            data_aquisicao: '2021-05-09T03:00:00.000Z',
            id_orgao_aquisicao: 51,
          },
          prefixo: {
            prefixo_sequencia: '14   ',
            prefixo_tipo: '22',
            emprego: '1',
          },
          identificador: {
            data_identificador: '2021-05-09T03:00:00.000Z',
            identificador: '456',
          },
          ano_fabricacao: 2021,
          ano_modelo: 2021,
          referenciasPneus: [{ id_pneu: 1 }],
          id_cor: '11',
          id_marca: '14',
          id_veiculo_especie: '6',
          valor_fipe: '1.23',
          codigo_seguranca_crv: makeStringNumber(11),
          numero_crv: makeStringNumber(10),
          combustivel: '3',
          id_modelo: '83',
          uf: '10',
          observacao: '',
          numero_doc_carga: '',
          renavam: null,
          tombo: null,
          chassi: '45y',
          km: 5,
        },
      })
      .set({
        'Content-Type': 'application/json',
      })
      .set('Authorization', `Bearer ${token}`);

    expect(result.statusCode).toBe(201);

    done();
  });

  test('should return 201 when create veiculo with valid km', async () => {
    const result = await request(app)
      .post('/veiculos')
      .send({
        body: {
          aquisicao: {
            origem_aquisicao: EOrigemDeAquisicao.CESSAO,
            data_aquisicao: '2021-05-09T03:00:00.000Z',
            id_orgao_aquisicao: 51,
          },
          prefixo: {
            prefixo_sequencia: makeStringNumber(4),
            prefixo_tipo: '22',
            emprego: '1',
          },
          identificador: {
            data_identificador: '2021-05-09T03:00:00.000Z',
            identificador: makeStringNumber(6),
          },
          ano_fabricacao: 2021,
          ano_modelo: 2021,
          referenciasPneus: [{ id_pneu: 1 }],
          id_cor: '11',
          id_marca: '14',
          id_veiculo_especie: '6',
          valor_fipe: '1.23',
          codigo_seguranca_crv: makeStringNumber(11),
          numero_crv: makeStringNumber(10),
          combustivel: '3',
          id_modelo: '83',
          uf: '10',
          observacao: '',
          numero_doc_carga: '',
          renavam: null,
          tombo: null,
          chassi: makeString(18),
          km: 3,
        },
      })
      .set({
        'Content-Type': 'application/json',
      })
      .set('Authorization', `Bearer ${token}`);

    expect(result.statusCode).toBe(201);

    expect(result.body).toMatchObject({
      km: 3,
    });
  });

  test('should return 400 if prefixo.emprego is not related to prefixo.prefixo_tipo', async () => {
    const result = await request(app)
      .post('/veiculos')
      .send({
        body: {
          aquisicao: {
            origem_aquisicao: EOrigemDeAquisicao.CESSAO,
            data_aquisicao: '2021-05-09T03:00:00.000Z',
            id_orgao_aquisicao: 51,
          },
          prefixo: {
            prefixo_tipo: EPrefixoTipo['21 - ADM'],
            prefixo_sequencia: makeString(5),
            emprego: EEmprego['Operacional - Caracterizada'],
          },
          identificador: {
            data_identificador: '2021-05-09T03:00:00.000Z',
            identificador: makeStringNumber(6),
          },
          ano_fabricacao: 2021,
          ano_modelo: 2021,
          referenciasPneus: [{ id_pneu: 1 }],
          id_cor: '11',
          id_marca: '14',
          id_veiculo_especie: '6',
          valor_fipe: '1.23',
          codigo_seguranca_crv: makeStringNumber(11),
          numero_crv: makeStringNumber(10),
          combustivel: '3',
          id_modelo: '83',
          uf: '10',
          observacao: '',
          numero_doc_carga: '',
          renavam: null,
          tombo: null,
          chassi: makeString(18),
          km: 3,
        },
      })
      .set({
        'Content-Type': 'application/json',
      })
      .set('Authorization', `Bearer ${token}`);

    expect(result.statusCode).toBe(400);
    expect(result.body.errors.prefixo[0]).toBe(
      'Emprego e Prefixo Tipo enviados nao se relacionam',
    );
  });

  test('should return 201 if can create veiculo with prefixo.prefixo_tipo is related to prefixo.emprego', async () => {
    const result = await request(app)
      .post('/veiculos')
      .send({
        body: {
          aquisicao: {
            origem_aquisicao: EOrigemDeAquisicao.CESSAO,
            data_aquisicao: '2021-05-09T03:00:00.000Z',
            id_orgao_aquisicao: 51,
          },
          prefixo: {
            prefixo_tipo: EPrefixoTipo['21 - ADM'],
            prefixo_sequencia: makeString(5),
            emprego: EEmprego['Não Consta'],
          },
          identificador: {
            data_identificador: '2021-05-09T03:00:00.000Z',
            identificador: makeStringNumber(6),
          },
          ano_fabricacao: 2021,
          ano_modelo: 2021,
          referenciasPneus: [{ id_pneu: 1 }],
          id_cor: '11',
          id_marca: '14',
          id_veiculo_especie: '6',
          valor_fipe: '1.23',
          codigo_seguranca_crv: makeStringNumber(11),
          numero_crv: makeStringNumber(10),
          combustivel: '3',
          id_modelo: '83',
          uf: '10',
          observacao: '',
          numero_doc_carga: '',
          renavam: null,
          tombo: null,
          chassi: makeString(18),
          km: 3,
        },
      })
      .set({
        'Content-Type': 'application/json',
      })
      .set('Authorization', `Bearer ${token}`);

    expect(result.statusCode).toBe(201);
  });

  test('should return 201 if can create veiculo with null codigo_seguranca_crv and numero_crv', async () => {
    const result = await request(app)
      .post('/veiculos')
      .send({
        body: {
          aquisicao: {
            origem_aquisicao: EOrigemDeAquisicao.CESSAO,
            data_aquisicao: '2021-05-09T03:00:00.000Z',
            id_orgao_aquisicao: 51,
          },
          prefixo: {
            prefixo_tipo: EPrefixoTipo['21 - ADM'],
            prefixo_sequencia: makeString(5),
            emprego: EEmprego['Não Consta'],
          },
          identificador: {
            data_identificador: '2021-05-09T03:00:00.000Z',
            identificador: makeStringNumber(6),
          },
          ano_fabricacao: 2021,
          ano_modelo: 2021,
          referenciasPneus: [{ id_pneu: 1 }],
          id_cor: '11',
          id_marca: '14',
          id_veiculo_especie: '6',
          valor_fipe: '1.23',
          codigo_seguranca_crv: null,
          numero_crv: undefined,
          combustivel: '3',
          id_modelo: '83',
          uf: '10',
          observacao: '',
          numero_doc_carga: '',
          renavam: null,
          tombo: null,
          chassi: makeString(18),
          km: 3,
        },
      })
      .set({
        'Content-Type': 'application/json',
      })
      .set('Authorization', `Bearer ${token}`);

    expect(result.statusCode).toBe(201);
  });
});
