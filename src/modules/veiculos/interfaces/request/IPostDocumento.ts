import { IPostMovimentacaoDocument } from './IPostMovimentacaoDocument';

export type IPostDocument = {
  user_id: string;
  movimentacao: IPostMovimentacaoDocument;
};
