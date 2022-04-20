import VeiculoModelo from '@modules/veiculos/entities/VeiculoModelo';

export type IResponseVeiculosModelos = {
  items: VeiculoModelo[];
  total: number;
  totalPage: number;
};
