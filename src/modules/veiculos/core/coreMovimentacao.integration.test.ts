import 'reflect-metadata';
import { createConnection, getConnection } from 'typeorm';
import AppError from '../../../errors/AppError';
import CoreMovimentacao from './CoreMovimentacao';
import container from '../../../container';
import ETipoMovimentacao from '../enums/ETipoMovimentacao';
import EFase from '../enums/EFase';
import Oficina from '../entities/Oficina';

describe('Integration test suite for coreMovimentacao', () => {
  let coreMovimentacao: CoreMovimentacao;

  beforeAll(async () => {
    await createConnection();
    coreMovimentacao = container.resolve(CoreMovimentacao);

    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Oficina)
      .values([
        {
          ativo: '1',
          cep: '60860390',
          cpf_cnpj: '00000000000',
          endereco: 'rua chico mota',
          numero: '627',
          id_municipio: '230440',
          nome: 'Oficina 1',
          criado_por: '30891368',
          id_oficina: '5f608ce9-bc50-47d0-a239-3dbe458d6053',
        },
      ])
      .execute();
  });

  test('should throw an error when list movimentacao by incorrect value for opm', async () => {
    try {
      await coreMovimentacao.list({
        opms: 'aosg',
        page: 1,
        perPage: 10,
      });
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
    }
  });

  test('should get an empty array of movimentacoes by incorrect opm', async () => {
    const { items } = await coreMovimentacao.list({
      opms: '1463',
      page: 1,
      perPage: 10,
    });
    expect(items.length).toBe(0);
  });

  test('should get an array of movimentacoes by opm', async () => {
    const { items } = await coreMovimentacao.list({
      opms: '1472',
      page: 1,
      perPage: 10,
    });
    expect(items.length).toBe(9);
  });

  test('should get an array of movimentacoes by opm', async () => {
    const { items } = await coreMovimentacao.list({
      opms: '-1',
      page: 1,
      perPage: 10,
    });
    expect(items.length).toBe(9);
  });

  test('should throw an error page or perPage is NaN', async () => {
    try {
      await coreMovimentacao.list({
        opms: '1472',
        page: Number.NaN,
        perPage: 10,
      });
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
    }
  });

  test('should get paginated movimentacoes by opm', async () => {
    const { total, totalPage } = await coreMovimentacao.list({
      opms: '1472',
      page: 1,
      perPage: 10,
    });
    expect(total).toBe(9);
    expect(totalPage).toBe(1);
  });

  test('should throw an error if tipoMovimentacao is not in enum TipoMovimentacao', async () => {
    try {
      await coreMovimentacao.list({
        opms: '1472',
        page: 1,
        perPage: 10,
        tipoMovimentacao: 0,
      });
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
    }
  });

  test('should return all movimentacoes by enum tipoMovimentacao', async () => {
    const { total } = await coreMovimentacao.list({
      opms: '1472',
      page: 1,
      perPage: 10,
      tipoMovimentacao: ETipoMovimentacao.TRANSFERENCIA,
    });

    expect(total).toBe(9);
  });

  test('should throw an error if faseMovimentacao is not in enum Efase', async () => {
    try {
      await coreMovimentacao.list({
        opms: '1472',
        page: 1,
        perPage: 10,
        fase: 9,
      });
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
    }
  });

  test('should throw an error if faseMovimentacao is not in tipoMovimentacaoFase', async () => {
    try {
      await coreMovimentacao.list({
        opms: '1472',
        page: 1,
        perPage: 10,
        tipoMovimentacao: ETipoMovimentacao.TRANSFERENCIA,
        fase: EFase.Concessão,
      });
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
    }
  });

  test('should return all movimentacoes by enum tipoMovimentacao and enum fase', async () => {
    await coreMovimentacao.createMovimentacaoFase('1', {
      criado_por: '30891368',
      id_tipo_movimentacao_fase: EFase.Oferta,
      data_movimentacao: new Date(),
      id_tipo_movimentacao: ETipoMovimentacao.TRANSFERENCIA,
      movimentacao: {
        id_opm_destino: 1463,
      },
      id_opm_origem: 1472,
    });

    const { total } = await coreMovimentacao.list({
      opms: '1472',
      page: 1,
      perPage: 10,
      tipoMovimentacao: ETipoMovimentacao.TRANSFERENCIA,
      fase: EFase.Oferta,
    });

    expect(total).toBe(1);
  });

  test('should return all movimentacoes by enum fase', async () => {
    const { total } = await coreMovimentacao.list({
      opms: '1472',
      page: 1,
      perPage: 10,
      tipoMovimentacao: ETipoMovimentacao.TRANSFERENCIA,
      fase: EFase.Oferta,
    });

    expect(total).toBe(1);
  });

  test('should throw an error on invalid type of pending signature', async () => {
    try {
      await coreMovimentacao.list({
        opms: '1472',
        page: 1,
        perPage: 10,
        pendingSignature: 'abc' as '0' | '1',
      });
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
    }
  });

  test('should throw an error on invalid type of pending signature', async () => {
    const { total } = await coreMovimentacao.list({
      opms: '1472',
      page: 1,
      perPage: 10,
      pendingSignature: '0',
    });
    expect(total).toBe(1);
  });

  test('should return all movimentacoes with signature by fase', async () => {
    await coreMovimentacao.createMovimentacaoFase('1', {
      criado_por: '30891368',
      id_tipo_movimentacao_fase: EFase['Pendente Assinatura'],
      data_movimentacao: new Date(),
      id_movimentacao: 10,
    });

    const { total } = await coreMovimentacao.list({
      opms: '1472',
      page: 1,
      perPage: 10,
      pendingSignature: '1',
      fase: EFase.Oferta,
    });

    expect(total).toBe(1);
  });

  test('should throw an error on invalid id_veiculo for search movimentacoes', async () => {
    try {
      await coreMovimentacao.list({
        id: Number.NaN,
        page: 1,
        perPage: 10,
        opms: '1472',
      });
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
    }
  });

  test('should return all movimentacos by id veiculo', async () => {
    const { total } = await coreMovimentacao.list({
      opms: '1472',
      page: 1,
      perPage: 10,
      id: 1,
    });
    expect(total).toBe(2);
  });

  test('should return 400 if cannot reach route sga', async () => {
    try {
      await coreMovimentacao.createMovimentacaoFase('2', {
        criado_por: '30891368',
        id_tipo_movimentacao_fase: EFase.Oferta,
        data_movimentacao: new Date(),
        id_tipo_movimentacao: ETipoMovimentacao.TRANSFERENCIA,
        movimentacao: {
          id_opm_destino: 1463,
        },
        id_opm_origem: 1472,
      });
      expect(true).toBe(false);
    } catch (error) {
      expect(error.isAxiosError).toBe(true);
    }
  });

  test('should create manutencao veiculo', async () => {
    const response = await coreMovimentacao.createMovimentacaoFase('1', {
      criado_por: '30891368',
      id_tipo_movimentacao_fase: EFase.Entrega,
      data_movimentacao: new Date(),
      id_tipo_movimentacao: ETipoMovimentacao.MANUTENCAO,
      id_opm_origem: 1472,
      manutencao: {
        id_oficina: '5f608ce9-bc50-47d0-a239-3dbe458d6053',
      },
    });

    expect(response).toMatchObject({
      criado_por: '30891368',
      id_tipo_fase: EFase.Entrega,
    });
  });

  test.only('should return an list containg all manutencoes by id veiculo', async () => {
    const { items, total } = await coreMovimentacao.list({
      tipoMovimentacao: ETipoMovimentacao.MANUTENCAO,
      opms: '-1',
      page: 1,
      perPage: 10,
    });

    expect(total).toBe(1);
    expect(items[0]).toMatchObject({
      id_veiculo: 1,
      id_tipo_movimentacao: ETipoMovimentacao.MANUTENCAO,
    });
  });
});
