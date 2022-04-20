import ETipoDocumento from '@modules/veiculos/enums/ETipoDocumento';

export type IPostResponseDocumentoSGA = {
  id_sistema: string;

  id_documento_origem: number;
  numero_documento: string;
  id_tipo_documento: ETipoDocumento;
  tipo_documento: string;
  cpfs_interessados: string;
  qtd_pg_documento_original: number;

  ext: string;

  id_documento: number;
  hash_sha1: string;
  hash_md5: string;
  verificador: string;
  assinado: boolean;

  path: string;
  url: string;
};
