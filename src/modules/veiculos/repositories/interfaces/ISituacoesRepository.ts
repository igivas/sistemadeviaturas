import SituacaoVeiculo from '@modules/veiculos/entities/SituacaoVeiculo';
import { IDefaultRepository } from './IDefaultRepository';

export default interface ISituacoesRepository
  extends IDefaultRepository<SituacaoVeiculo> {
  findById(id: number): Promise<SituacaoVeiculo | undefined>;
  findByVeiculoId(
    id_veiculo: number,
    page?: number,
    perPage?: number,
  ): Promise<{
    total: number;
    totalPage: number;
    situacoes: SituacaoVeiculo[];
  }>;

  findLastByIdVeiculo(id_veiculo: number): Promise<SituacaoVeiculo>;

  findActiveSituacaoByIdSituacao(
    id_situacao_veiculo: number,
  ): Promise<SituacaoVeiculo | undefined>;

  findSituacoesVeiculoBeforeDate(
    id_veiculo: number,
    data_situacao: Date,
  ): Promise<SituacaoVeiculo | undefined>;

  findSituacoesVeiculoAfterDate(
    id_veiculo: number,
    data_situacao: Date,
  ): Promise<SituacaoVeiculo | undefined>;
}
