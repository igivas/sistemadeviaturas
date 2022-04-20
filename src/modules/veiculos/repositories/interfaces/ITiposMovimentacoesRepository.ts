import TipoMovimentacao from '@modules/veiculos/entities/TipoMovimentacao';

export default interface ITiposMovimentacoesRepository {
  findAll(): Promise<TipoMovimentacao[]>;
  findOne(id_tipo_movimentacao: number): Promise<TipoMovimentacao | undefined>;
}
