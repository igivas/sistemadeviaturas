interface IKm {
  km_atual: number;
  criado_em: Date;
  criado_por: string;
  data_km: Date;
}

export type IResponseKms = {
  total: number;
  totalPage: number;
  items: IKm[];
};
