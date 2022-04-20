import ETipoMovimentacao from '@modules/veiculos/enums/ETipoMovimentacao';

export type IMovimentacao = {
  id_movimentacao: number;
  id_tipo_movimentacao: ETipoMovimentacao;
  data_movimentacao: Date;
  assinado_origem?: '0' | '1';
  assinado_destino?: '0' | '1';
  opm_origem?: object;
  opm_destino?: object;
  justificativa: string;
  fases: {
    id_movimentacao_fase: number;
  }[];
};

export type IResponseMovimentacao = {
  total: number;
  totalPage: number;
  items: IMovimentacao[];
};
