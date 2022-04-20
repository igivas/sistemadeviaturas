import DadoMovimentacaoMudancaVeiculo from '@modules/veiculos/entities/DadoMovimentacaoMudancaVeiculo';
import { IDefaultRepository } from './IDefaultRepository';

export default interface IDadosMovimentacoesMudancasVeiculosRepository
  extends IDefaultRepository<DadoMovimentacaoMudancaVeiculo> {
  findByIdMovimentacao(
    id_movimentacao: number,
  ): Promise<DadoMovimentacaoMudancaVeiculo>;
}
