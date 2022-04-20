import ETipoMovimentacao from '@modules/veiculos/enums/ETipoMovimentacao';

export type IPostMovimentacaoDocument = {
  id_tipo_movimentacao: ETipoMovimentacao;
  id_opm_origem: number;
  id_opm_destino: number;
  id_veiculo: string;
  data_movimentacao: Date;
  id_opm_mediadora?: number;
};
