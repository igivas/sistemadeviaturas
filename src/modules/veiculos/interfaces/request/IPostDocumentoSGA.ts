import ETipoDocumento from '@modules/veiculos/enums/ETipoDocumento';

export type IPostDocumentoSGA = {
  id_sistema: number;
  cpfs_interessados: string;
  numero_documento: string;

  id_documento_origem: number;

  id_tipo_documento: ETipoDocumento;
  tipo_documento: string;
};
