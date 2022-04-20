import { IPostMovimentacao } from './IPostMovimentacao';

export type IPostMovimentacaoEmprestimo = IPostMovimentacao & {
  data_retorno?: Date;
};
