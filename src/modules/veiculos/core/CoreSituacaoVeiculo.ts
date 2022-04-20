import { injectable, inject, container, singleton } from 'tsyringe';
import { getConnection } from 'typeorm';
import { compareAsc } from 'date-fns';
import { ICreateSituacaoVeiculo } from '../interfaces/core/ICoreSituacaoVeiculo';
import IKmsRepository from '../repositories/interfaces/IKmsRepository';
import IVeiculosRepository from '../repositories/interfaces/IVeiculosRepository';
import AppError from '../../../errors/AppError';
import SituacaoVeiculo from '../entities/SituacaoVeiculo';
import Veiculo from '../entities/Veiculo';
import Km from '../entities/Km';
import {
  IResponseSituacao,
  ISituacao,
} from '../interfaces/response/IResponseSituacao';
import ISituacoesRepository from '../repositories/interfaces/ISituacoesRepository';
import { IGetSituacoesVeiculo } from '../interfaces/request/IGetSituacoesVeiculo';
import CoreKm from './CoreKm';
import IMovimentacoesRepository from '../repositories/interfaces/IMovimentacoesRepository';
import ETipoMovimentacao from '../enums/ETipoMovimentacao';
import { IVeiculosLocalizacoesRepository } from '../repositories/interfaces/IVeiculosLocalizacoesRepository';
import VeiculoLocalizacao from '../entities/VeiculoLocalizacao';

@injectable()
@singleton()
class CoreSituacaoVeiculo {
  constructor(
    @inject('KmsRepository')
    private kmsRepository: IKmsRepository,

    @inject('VeiculosRepository')
    private veiculosRepository: IVeiculosRepository,

    @inject('SituacoesVeiculoRepository')
    private situacoesVeiculoRepository: ISituacoesRepository,

    @inject('MovimentacoesRepository')
    private movimentacoesRepository: IMovimentacoesRepository,

    @inject('VeiculosLocalizacoesRepository')
    private localizacoesReository: IVeiculosLocalizacoesRepository,
  ) {}

  async create({
    idVeiculo,
    id_usuario,
    situacao,
  }: ICreateSituacaoVeiculo): Promise<object> {
    const id_veiculo = Number.parseInt(idVeiculo, 10);

    if (Number.isNaN(id_veiculo)) throw new AppError('Id do veiculo inválido');

    const veiculo = await this.veiculosRepository.findById(idVeiculo);

    if (!veiculo) throw new AppError('Veiculo não encontrado');

    /* if (situacao.id_situacao_tipo === veiculo.id_situacao_tipo)
      throw new AppError('Situacao de veiculo ja existente'); */

    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    let newSituacao;
    try {
      const [
        orderedAndRemovedSituacoesAfterDate,
        orderedAndRemovedSituacoesBeforeDate,
      ] = await Promise.all([
        this.situacoesVeiculoRepository.findSituacoesVeiculoAfterDate(
          id_veiculo,
          situacao.data_situacao,
        ),
        this.situacoesVeiculoRepository.findSituacoesVeiculoBeforeDate(
          id_veiculo,
          situacao.data_situacao,
        ),
      ]);

      const coreKm = container.resolve(CoreKm);
      const movimentacaoBeforeOrEqualDataMovimentacao = await this.movimentacoesRepository.findMovimentacaoBeforeOrEqualDataMovimentacao(
        situacao.data_situacao,
        veiculo.id_veiculo,
      );

      if (orderedAndRemovedSituacoesBeforeDate) {
        const kmBeforeDate = await coreKm.findVeiculoKmBeforeDate(
          veiculo.id_veiculo,
          situacao.data_situacao,
        );

        if (
          kmBeforeDate &&
          !!coreKm.canResetKm(
            kmBeforeDate.km_atual,
            veiculo.id_veiculo_especie,
          ) === !!(kmBeforeDate.km_atual > situacao.km)
        )
          throw new AppError(
            `Km atual menor que o km inserido na data ${orderedAndRemovedSituacoesBeforeDate.data_situacao}`,
          );

        if (
          orderedAndRemovedSituacoesBeforeDate.id_situacao_tipo ===
          situacao.id_situacao_tipo
        )
          throw new AppError(
            `Tipo de situação é o mesmo da data ${orderedAndRemovedSituacoesBeforeDate.data_situacao}`,
          );

        if (
          movimentacaoBeforeOrEqualDataMovimentacao &&
          movimentacaoBeforeOrEqualDataMovimentacao.tipo_movimentacao ===
            ETipoMovimentacao.MANUTENCAO
        )
          throw new AppError(
            'Não pode inserir uma situação onde a viatura já está baixada',
          );
      }

      if (orderedAndRemovedSituacoesAfterDate) {
        const kmAfterDate = await coreKm.findVeiculoKmAfterDate(
          veiculo.id_veiculo,
          situacao.data_situacao,
        );

        if (kmAfterDate && kmAfterDate.km_atual < situacao.km)
          throw new AppError(
            `Km atual maior que o km inserido que a data ${orderedAndRemovedSituacoesAfterDate.data_situacao}`,
          );
        else if (
          orderedAndRemovedSituacoesAfterDate.id_situacao_tipo ===
          situacao.id_situacao_tipo
        )
          throw new AppError(
            `Tipo de situação é o mesmo da data ${orderedAndRemovedSituacoesAfterDate.data_situacao}`,
          );

        if (
          movimentacaoBeforeOrEqualDataMovimentacao &&
          movimentacaoBeforeOrEqualDataMovimentacao.tipo_movimentacao ===
            ETipoMovimentacao.MANUTENCAO
        )
          throw new AppError(
            'Não pode inserir uma situação onde a viatura já está baixada',
          );
      }

      const createdKm = await this.kmsRepository.create(
        {
          km_atual: situacao.km,
          data_km: situacao.data_situacao,
          id_veiculo,
          criado_por: id_usuario,
        } as Km,
        queryRunner,
      );

      const newSituacaoInsert = await this.situacoesVeiculoRepository.create(
        {
          data_situacao: situacao.data_situacao,
          id_situacao_tipo: situacao.id_situacao_tipo,
          id_situacao_tipo_especificacao:
            situacao.id_situacao_tipo_especificacao === -1
              ? undefined
              : situacao.id_situacao_tipo_especificacao,
          criado_por: id_usuario,
          id_veiculo,
          id_km: createdKm.id_km,
        } as SituacaoVeiculo,
        queryRunner,
      );

      newSituacao = { ...newSituacaoInsert, km: createdKm.km_atual };

      if (
        !orderedAndRemovedSituacoesAfterDate ||
        (!!orderedAndRemovedSituacoesBeforeDate &&
          compareAsc(
            orderedAndRemovedSituacoesBeforeDate.data_situacao,
            situacao.data_situacao,
          ) >= 0)
      ) {
        const veiculoMerged = queryRunner.manager.merge(Veiculo, veiculo, {
          id_situacao_tipo: situacao.id_situacao_tipo,
          id_situacao_especificacao_atual:
            situacao.id_situacao_tipo_especificacao === -1
              ? undefined
              : situacao.id_situacao_tipo_especificacao,
        });

        await queryRunner.manager.save(Veiculo, veiculoMerged);
      }

      await this.localizacoesReository.create(
        {
          data_localizacao: situacao.data_situacao,
          localizacao: situacao.localizacao,
          criado_por: id_usuario,
          id_veiculo: veiculo.id_veiculo,
        } as VeiculoLocalizacao,
        queryRunner,
      );

      await queryRunner.commitTransaction();
    } catch (error) {
      // console.log(error);

      await queryRunner.rollbackTransaction();
      if (!(error instanceof AppError))
        throw new AppError('Não pode criar situacao de veiculo');

      throw error;
    } finally {
      await queryRunner.release();
    }

    return newSituacao;
  }

  async list({
    id,
    page,
    perPage,
  }: IGetSituacoesVeiculo): Promise<IResponseSituacao> {
    try {
      let situacoesVeiculoResponse;

      const numberId = parseInt(id, 10);
      const pageNumber = parseInt(page, 10);
      const perPageNumber = parseInt(perPage, 10);

      const isPagedAndPerPage =
        Number.isNaN(pageNumber) && Number.isNaN(perPageNumber);
      const isNotPagedAndNotPerPage =
        !Number.isNaN(pageNumber) && !Number.isNaN(perPageNumber);

      if (
        (!isPagedAndPerPage && !isNotPagedAndNotPerPage) ||
        Number.isNaN(numberId)
      ) {
        throw new AppError('Parametros invalidos');
      }

      if (isNotPagedAndNotPerPage)
        situacoesVeiculoResponse = await this.situacoesVeiculoRepository.findByVeiculoId(
          numberId,
          0,
          0,
        );
      else if (isPagedAndPerPage) {
        situacoesVeiculoResponse = await this.situacoesVeiculoRepository.findByVeiculoId(
          numberId,
          pageNumber,
          perPageNumber,
        );
      }

      if (!situacoesVeiculoResponse)
        throw new AppError('Nenhuma situacao dado o veiculo encontrada');

      const situacoesVeiculoNomes = situacoesVeiculoResponse.situacoes.map<ISituacao>(
        situacao => {
          return {
            id_situacao: situacao.id_situacao_veiculo,
            nome: situacao.situacaoTipo.nome,
            motivo: situacao.situacaoTipo.criado_por || undefined,
            observacao: situacao.observacao,
            criado_em: situacao.criado_em,
            data_situacao: situacao.data_situacao,
            km: situacao.kmSituacao?.km_atual || 0,
          };
        },
      );
      return {
        total: perPageNumber,
        totalPage: pageNumber,
        situacoes: situacoesVeiculoNomes,
      };
    } catch (error) {
      throw new AppError(error);
    }
  }
}

export default CoreSituacaoVeiculo;
