import ETipoMovimentacao from '@modules/veiculos/enums/ETipoMovimentacao';
import EFase from '@modules/veiculos/enums/EFase';

export type IGetMovimentacoes = {
  opms: string;
  tipoMovimentacao?: ETipoMovimentacao;
  fase?: EFase;
  page: number;
  perPage: number;
  pendingSignature?: '0' | '1';
  id?: number;
  fields?: string[];
  query?: string;
  fieldSort?: string[];
  orderSort?: string[];
};
