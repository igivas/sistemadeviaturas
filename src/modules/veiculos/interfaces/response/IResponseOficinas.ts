import Oficina from '@modules/veiculos/entities/Oficina';

export type IResponseOficinas = {
  items: Oficina[];
  total: number;
  totalPage: number;
};
