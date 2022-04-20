import 'reflect-metadata';
import { getConnection, QueryRunner, createConnection } from 'typeorm';
import EFase from '@modules/veiculos/enums/EFase';
import ETipoMovimentacao from '@modules/veiculos/enums/ETipoMovimentacao';
import MovimentacaoService from '@modules/veiculos/services/MovimentacaoService';
import container from '../../../../container';
import CoreEmprestimo from './CoreEmprestimo';
import AppError from '../../../../errors/AppError';

describe('integration tet suite for movimentacao emprestimo', () => {
  let coreEmprestimo: CoreEmprestimo;
  let queryRunner: QueryRunner;
  let idMovimentacao: number;

  beforeAll(async () => {
    await createConnection();
    coreEmprestimo = container.resolve(CoreEmprestimo);
  });

  beforeEach(async () => {
    queryRunner = getConnection().createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
  });

  test('should throw an error on invalid id_veiculo', async () => {
    try {
      await coreEmprestimo.handleMovimentacao(
        {
          id_veiculo: Number.NaN,
          criado_por: '30891368',
          id_tipo_movimentacao_fase: EFase.Oferta,
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
      await coreEmprestimo.handleMovimentacao(
        {
          id_veiculo: -1,
          criado_por: '30891368',
          id_tipo_movimentacao_fase: EFase.Oferta,
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

  test('should throw an error on invalid id_tipo_movimentacao_fase', async () => {
    try {
      await coreEmprestimo.handleMovimentacao(
        {
          id_veiculo: 1,
          criado_por: '30891368',
          id_tipo_movimentacao_fase: EFase.Entrega,
        },
        queryRunner,
      );
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe('Fase não existente');
    }
  });

  test.skip('should throw an error on id_opm_destino and id_opm on carga is the same', async () => {
    const movimentacaoService = container.resolve(MovimentacaoService);

    const emprestimoToCreate = {
      criado_por: '30891368',
      id_tipo_movimentacao_fase: EFase.Oferta,
      id_veiculo: 1,
      data_movimentacao: new Date(2021, 8, 13),
      id_tipo_movimentacao: ETipoMovimentacao.EMPRESTIMO,
      data_retorno: new Date(2021, 8, 14),
      id_opm_destino: 1472,
      id_opm_origem: 1472,
    };

    await movimentacaoService.createOferta(
      {
        ...emprestimoToCreate,
        opm_destino_comandante: '30891368',
        opm_origem_comandante: '30891368',
        observacao: 'mock emprestimo',
        url_documento_sga: undefined as any,
        id_documento_sga: undefined as any,
        assinado_destino: '0',
        assinado_origem: '0',
      },
      queryRunner,
    );

    await queryRunner.commitTransaction();

    await queryRunner.startTransaction();

    try {
      await coreEmprestimo.handleMovimentacao(
        { ...emprestimoToCreate },
        queryRunner,
      );

      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe('Origem do veiculo está incorreta');
    }
  });

  test('should create fase oferta', async () => {
    const response = await coreEmprestimo.handleMovimentacao(
      {
        criado_por: '30891368',
        id_tipo_movimentacao_fase: EFase.Oferta,
        id_veiculo: 1,
        data_movimentacao: new Date(2021, 8, 13),
        id_tipo_movimentacao: ETipoMovimentacao.EMPRESTIMO,
        data_retorno: new Date(2021, 8, 14),
        id_opm_destino: 1472,
        id_opm_origem: 1472,
      },
      queryRunner,
    );

    idMovimentacao = response.id_movimentacao;

    expect(response).toMatchObject({
      id_tipo_fase: EFase.Oferta,
      criado_por: '30891368',
    });
  });

  test('origin should sign oferta', async () => {
    const response = await coreEmprestimo.handleMovimentacao(
      {
        id_movimentacao: idMovimentacao,
        criado_por: '30891368',
        id_tipo_movimentacao_fase: EFase['Pendente Assinatura'],
        cpf: '02034282345',
        assinatura: 'assinatura',
        pin: '1234',
        id_veiculo: 1,
      },
      queryRunner,
    );

    expect(response).toMatchObject({
      id_tipo_fase: EFase.Oferta,
      criado_por: '30891368',
    });
  });

  test('should create fase recebimento', async () => {
    const response = await coreEmprestimo.handleMovimentacao(
      {
        id_movimentacao: idMovimentacao,
        criado_por: '30891368',
        id_tipo_movimentacao_fase: EFase.Recebimento,
        cpf: '02034282345',
        assinatura: 'assinatura',
        pin: '1234',
        id_veiculo: 1,
      },
      queryRunner,
    );

    expect(response).toMatchObject({
      id_tipo_fase: EFase.Recebimento,
      criado_por: '30891368',
      id_next_tipo_fase: EFase.Devolução,
    });
  });

  test.skip('should create fase recusado', async () => {
    const response = await coreEmprestimo.handleMovimentacao(
      {
        id_movimentacao: idMovimentacao,
        criado_por: '30891368',
        id_tipo_movimentacao_fase: EFase.Recusado,
        cpf: '02034282345',
        assinatura: 'assinatura',
        pin: '1234',
        id_veiculo: 5,
      },
      queryRunner,
    );

    expect(response).toMatchObject({
      id_tipo_fase: EFase.Recusado,
      criado_por: '30891368',
      id_movimentacao: idMovimentacao,
    });
  });

  test.skip('should throw on attempt to create fase devolucao when id_next_tipo_fase is not devlucao', async () => {
    try {
      await coreEmprestimo.handleMovimentacao(
        {
          id_movimentacao: idMovimentacao,
          criado_por: '30891368',
          id_tipo_movimentacao_fase: EFase.Devolução,
          cpf: '02034282345',
          assinatura: 'assinatura',
          pin: '1234',
          id_veiculo: 1,
        },
        queryRunner,
      );
      expect(true).toBe(false);
    } catch (error) {
      console.log(error);

      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe(
        'Veiculo so pode ser devolvido se a fase anterior for recebimento',
      );
    }
  });

  test('should create fase devolucao', async () => {
    const response = await coreEmprestimo.handleMovimentacao(
      {
        id_movimentacao: idMovimentacao,
        criado_por: '30891368',
        id_tipo_movimentacao_fase: EFase.Devolução,
        cpf: '02034282345',
        assinatura: 'assinatura',
        pin: '1234',
        id_veiculo: 1,
      },
      queryRunner,
    );

    expect(response).toMatchObject({
      id_movimentacao: idMovimentacao,
      id_tipo_fase: EFase.Devolução,
    });
  });
});
