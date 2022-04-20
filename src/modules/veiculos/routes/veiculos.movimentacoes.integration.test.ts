// eslint-disable-next-line import/no-extraneous-dependencies
import request from 'supertest';
import { createConnection } from 'typeorm';
import app from '../../../app';
import ETipoMovimentacaoFase from '../enums/ETipoMovimentacaoFase';
import ETipoMovimentacao from '../enums/ETipoMovimentacao';
import EFase from '../enums/EFase';

describe.skip('Integration test suite for validate route veiculos movimentacoes', () => {
  let token: any;

  beforeAll(async (done: any) => {
    await createConnection();

    const response = await request(app).post('/sessions').send({
      matricula: '30891368',
      senha: 'Chicojj123',
    });

    token = response.body.token; // save the token!
    done();
  });

  test('should return 400 if id_tipo_movimentacao or id_movimentacao is not set', async () => {
    const response = await request(app)
      .post('/veiculos/10/movimentacoes')
      .send({
        body: {
          id_tipo_movimentacao_fase: ETipoMovimentacaoFase.oferta,
        },
      })
      .set({
        'Content-Type': 'application/json',
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(400);
    expect(response.body).toMatchObject({
      message:
        'Não pode criar movimentacao sem o tipo de movimentacao ou o id da movimentacao',
    });
  });

  test('should return 400 if id_tipo_movimentacao or id_tipo_movimentacao_fase not matches', async () => {
    const response = await request(app)
      .post('/veiculos/10/movimentacoes')
      .send({
        body: {
          id_tipo_movimentacao: ETipoMovimentacao.TRANSFERENCIA,
          id_tipo_movimentacao_fase: EFase.Concessão,
        },
      })
      .set({
        'Content-Type': 'application/json',
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(400);
    expect(response.body).toMatchObject({
      message: 'Tipo de movimentacao e sua fase nao se relacionam',
    });
  });

  test('should return 400 if id_tipo_movimentacao is oferta id_opm_origem not set', async () => {
    const response = await request(app)
      .post('/veiculos/10/movimentacoes')
      .send({
        body: {
          id_tipo_movimentacao: ETipoMovimentacao.TRANSFERENCIA,
          id_tipo_movimentacao_fase: EFase.Oferta,
        },
      })
      .set({
        'Content-Type': 'application/json',
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(400);
    expect(response.body).toMatchObject({
      message: 'Não pode ofertar sem opms',
    });
  });

  test('should return 400 if id_tipo_movimentacao is oferta id_opm_destino not set', async () => {
    const response = await request(app)
      .post('/veiculos/10/movimentacoes')
      .send({
        body: {
          id_tipo_movimentacao: ETipoMovimentacao.TRANSFERENCIA,
          id_tipo_movimentacao_fase: EFase.Oferta,
          id_opm_origem: 1050,
        },
      })
      .set({
        'Content-Type': 'application/json',
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(400);
    expect(response.body).toMatchObject({
      message: 'Não pode ofertar sem opms',
    });
  });

  test.skip('should return 201 if can create a new movimentacao fase', async () => {
    const response = await request(app)
      .post('/veiculos/10/movimentacoes')
      .send({
        body: {
          id_tipo_movimentacao: ETipoMovimentacao.TRANSFERENCIA,
          id_tipo_movimentacao_fase: EFase.Oferta,
          id_opm_origem: 1050,
          id_opm_destino: 1070,
        },
      })
      .set({
        'Content-Type': 'application/json',
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(201);
    expect(response.body).toMatchObject({
      criado_por: '30891368',
      id_tipo_fase: EFase.Oferta,
    });
  });

  test('should return 400 when try to fase oferta for veiculo and already is on oferta ', async () => {
    const response = await request(app)
      .post('/veiculos/10/movimentacoes')
      .send({
        body: {
          id_tipo_movimentacao: ETipoMovimentacao.TRANSFERENCIA,
          id_tipo_movimentacao_fase: EFase.Oferta,
          id_opm_origem: 1050,
          id_opm_destino: 1080,
        },
      })
      .set({
        'Content-Type': 'application/json',
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(400);
    expect(response.body).toMatchObject({
      message: 'Este veiculo não esta operando ou ja esta em outra oferta',
    });
  });
});
