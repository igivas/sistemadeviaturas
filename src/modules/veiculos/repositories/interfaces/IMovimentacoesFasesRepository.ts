import MovimentacaoFase from '@modules/veiculos/entities/MovimentacaoFase';
import { IDefaultRepository } from './IDefaultRepository';

export default interface IMovimentacoesFasesRepository
  extends IDefaultRepository<MovimentacaoFase> {
  findByVeiculoId(
    id: number,
    page?: number,
    perPage?: number,
  ): Promise<{
    total: number;
    totalPage: number;
    movimentacoes: MovimentacaoFase[];
  }>;

  findLastMovimentacaoByIdMovimentacao(
    id_movimentacao: number,
  ): Promise<MovimentacaoFase | undefined>;

  findAllByIdOpm(id_opm: string): Promise<MovimentacaoFase[]>;
}
