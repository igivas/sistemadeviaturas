import PessoaFisicaPm from '@modules/public/entities/PessoaFisicaPm';

export type IResponseCreateDocumentoMovimentacaoResponse = {
  documento: Buffer;
  pms: PessoaFisicaPm[];
};
