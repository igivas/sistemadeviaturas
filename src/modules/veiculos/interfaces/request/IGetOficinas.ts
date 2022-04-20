export type IGetOficinas = {
  page?: number;
  perPage?: number;
  active?: '0' | '1';
  query?: string;
  fields?: string[];

  fieldSort?: string[];
  orderSort?: string[];
};
