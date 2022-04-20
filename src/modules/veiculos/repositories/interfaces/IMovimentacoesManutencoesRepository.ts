import MovimentacaoManutencao from '@modules/veiculos/entities/MovimentacaoManutencao';
import { IDefaultRepository } from './IDefaultRepository';

export interface IMovimentacoesManutencoesRepository
  extends IDefaultRepository<MovimentacaoManutencao> {
  findByIdDadoMovimentacaoMudanca(
    id: number,
  ): Promise<MovimentacaoManutencao | undefined>;
}
