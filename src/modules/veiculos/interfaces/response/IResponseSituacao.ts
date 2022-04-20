export type ISituacao = {
  id_situacao?: number;
  data_situacao: Date;
  nome: string;
  motivo?: string;
  observacao: string | null;
  km: number;
  criado_em: Date;
};

export type IResponseSituacao = {
  total: number;
  totalPage: number;
  situacoes: ISituacao[];
};
