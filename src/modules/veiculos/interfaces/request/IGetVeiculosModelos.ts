export type IGetVeiculosModelos = {
  page?: number;
  perPage?: number;
  query?: string;
  fields?: string[];

  fieldSort?: string[];
  orderSort?: string[];
};
