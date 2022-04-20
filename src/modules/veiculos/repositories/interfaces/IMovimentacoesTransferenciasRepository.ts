import MovimentacaoTransferencia from '@modules/veiculos/entities/MovimentacaoTransferencia';
import { IDefaultRepository } from './IDefaultRepository';

export default interface IMovimentacoesTransferenciasRepository
  extends IDefaultRepository<MovimentacaoTransferencia> {
  findByIdDadoMovimentacaoMudancaVeiculo(
    id_dado_movimentacao_mudanca: number,
  ): Promise<MovimentacaoTransferencia>;
}
