export type IPostSituacao = {
  id_situacao_tipo: number;
  id_situacao_tipo_especificacao: number;
  km: number;
  data_situacao: Date;
  observacao?: string;
  localizacao: string;
};
