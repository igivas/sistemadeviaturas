import ETipoAssinatura from '@modules/veiculos/enums/ETipoAssinatura';

export type IPostAssinarDocumento = {
  ids_documento: number[];
  cpf_assinante: string;
  assinatura: string;
  pin: string;
  tipo_assinatura: ETipoAssinatura;
};
