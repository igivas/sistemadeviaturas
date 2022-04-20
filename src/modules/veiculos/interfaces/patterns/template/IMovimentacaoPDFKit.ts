import UnidadeDTOResponse from '@modules/veiculos/dto/Response/UnidadeDTOResponse';

export type IMovimentacaoPDFKit = {
  unidadeOrigem: UnidadeDTOResponse;
  dataAtual: Date;
  oficio: string;
};
