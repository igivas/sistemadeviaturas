import VeiculoLocalizacao from '@modules/veiculos/entities/VeiculoLocalizacao';

export type IResponseGetVeiculosLocalizacoes = {
  total: number;
  totalPage: number;
  items: VeiculoLocalizacao[];
};
