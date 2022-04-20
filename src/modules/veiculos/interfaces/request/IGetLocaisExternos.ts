export type IGetLocaisExternos = {
  opms: string;
  fields?: string[];
  query: string;
  page: number;
  perPage: number;
  fieldSort?: string[];
  orderSort?: string[];
};
