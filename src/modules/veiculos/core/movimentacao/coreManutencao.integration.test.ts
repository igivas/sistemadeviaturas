import 'reflect-metadata';
import { createConnection, getConnection, QueryRunner } from 'typeorm';
import EFase from '@modules/veiculos/enums/EFase';
import Oficina from '@modules/veiculos/entities/Oficina';
import CoreManutencao from './CoreManutencao';
import container from '../../../../container';
import AppError from '../../../../errors/AppError';

describe('Integration test suite for manutencao', () => {
  let coreManutencao: CoreManutencao;
  let queryRunner: QueryRunner;

  beforeAll(async () => {
    await createConnection();
    coreManutencao = container.resolve(CoreManutencao);

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

  beforeEach(async () => {
    queryRunner = getConnection().createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
  });

  test('should throw an error on invalid id_veiculo', async () => {
    try {
      await coreManutencao.handleMovimentacao(
        {
          id_veiculo: Number.NaN,
          criado_por: '30891368',
          id_tipo_movimentacao_fase: EFase.Entrega,
        },
        queryRunner,
      );
      expect(true).toBe(false);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe('Id do veiculo inválido');
    }
  });
  test('should throw an error if veiculo not exist', async () => {
    try {
      await coreManutencao.handleMovimentacao(
        {
          id_veiculo: -1,
          criado_por: '30891368',
          id_tipo_movimentacao_fase: EFase.Entrega,
        },
        queryRunner,
      );
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe('Veículo não existe');
    }
  });

  test('should throw an error on invalid oficina', async () => {
    try {
      await coreManutencao.handleMovimentacao(
        {
          id_veiculo: 1,
          criado_por: '30891368',
          id_oficina: 'db8ef2f4-dd20-4a73-bfc6-e3ff36938e98',
          id_tipo_movimentacao_fase: EFase.Entrega,
        },
        queryRunner,
      );
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe('Oficina não existe');
    }
  });

  test('should throw an error on invalid id_tipo_movimentacao_fase', async () => {
    try {
      await coreManutencao.handleMovimentacao(
        {
          id_veiculo: 1,
          criado_por: '30891368',
          id_oficina: '5f608ce9-bc50-47d0-a239-3dbe458d6053',
          id_tipo_movimentacao_fase: EFase.Concessão,
        },
        queryRunner,
      );
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe('Fase não existente');
    }
  });

  test.only('should create manutencao veiculo', async () => {
    const data = new Date();
    const response = await coreManutencao.handleMovimentacao(
      {
        criado_por: '30891368',
        id_tipo_movimentacao_fase: EFase.Entrega,
        id_veiculo: 1,
        id_oficina: '5f608ce9-bc50-47d0-a239-3dbe458d6053',
        motivo: 'Manutenção de 1000 km',
        data_movimentacao: new Date(
          data.getFullYear(),
          data.getMonth(),
          data.getDate(),
        ),
        id_opm_origem: 1472,
        km: 80000,
      },
      queryRunner,
    );

    expect(response).toMatchObject({
      criado_por: '30891368',
      id_tipo_fase: EFase.Entrega,
    });
  });

  test('should throw an error on non existent id_movimentacao', async () => {
    try {
      await coreManutencao.handleMovimentacao(
        {
          id_veiculo: 1,
          criado_por: '30891368',
          id_tipo_movimentacao_fase: EFase.Vistoria,
        },
        queryRunner,
      );
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe('Movimentacao não existente');
    }
  });

  test('should throw an error on invalid id_movimentacao', async () => {
    try {
      await coreManutencao.handleMovimentacao(
        {
          id_veiculo: 1,
          criado_por: '30891368',
          id_tipo_movimentacao_fase: EFase.Vistoria,
          id_movimentacao: Number.NaN,
        },
        queryRunner,
      );
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe('Movimentacao não existente');
    }
  });

  test('should throw an error non existent movimentacao', async () => {
    try {
      await coreManutencao.handleMovimentacao(
        {
          id_veiculo: 1,
          criado_por: '30891368',
          id_tipo_movimentacao_fase: EFase.Vistoria,
          id_movimentacao: 123,
        },
        queryRunner,
      );
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe(
        'Não existe movimentacao com o valor informado',
      );
    }
  });

  test('should throw an error on new fase vistoria and fase before entrega not signed', async () => {
    try {
      await coreManutencao.handleMovimentacao(
        {
          id_veiculo: 1,
          criado_por: '30891368',
          id_tipo_movimentacao_fase: EFase.Vistoria,
          id_movimentacao: 1,
        },
        queryRunner,
      );
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe(
        'Para realizar vistoria é necessario usuario assinar',
      );
    }
  });

  test('should sign movimentacao', async () => {
    const response = await coreManutencao.handleMovimentacao(
      {
        id_tipo_movimentacao_fase: EFase['Pendente Assinatura'],
        id_movimentacao: 1,
        id_veiculo: 1,
        criado_por: '30891368',
      },
      queryRunner,
    );

    expect(response).toMatchObject({
      id_tipo_fase: EFase.Entrega,
      id_next_tipo_fase: EFase.Vistoria,
    });
  });

  test('should create fase vistoria', async () => {
    const response = await coreManutencao.handleMovimentacao(
      {
        criado_por: '30891368',
        id_tipo_movimentacao_fase: EFase.Vistoria,
        id_oficina: '5f608ce9-bc50-47d0-a239-3dbe458d6053',
        id_veiculo: 1,
        id_movimentacao: 1,
      },
      queryRunner,
    );

    expect(response).toMatchObject({
      id_tipo_fase: EFase.Vistoria,
    });
  });

  test('should throw an error on create manutencao already existent by date', async () => {
    try {
      await coreManutencao.handleMovimentacao(
        {
          id_veiculo: 1,
          criado_por: '30891368',
          id_tipo_movimentacao_fase: EFase.Entrega,
          id_oficina: '5f608ce9-bc50-47d0-a239-3dbe458d6053',
          motivo: 'Manutenção de 1000 km',
          data_movimentacao: new Date(),
          id_opm_origem: 1472,
        },
        queryRunner,
      );
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe(
        'Veiculo já está em manutenção para esta data',
      );
    }
  });
});
