import VeiculoLocalizacao from '@modules/veiculos/entities/VeiculoLocalizacao';
import { IDefaultRepository } from './IDefaultRepository';

type FindVeiculosLocalizacoes = {
  opms?: number[];
  fields?: string[];
  fieldSort?: string[];
  orderSort?: string[];
};

export type IVeiculosLocalizacoesRepository = IDefaultRepository<VeiculoLocalizacao> & {
  findLocalizacoes(
    page: number,
    perPage: number,
    query: string,
    options: FindVeiculosLocalizacoes,
  ): Promise<[VeiculoLocalizacao[], number]>;
};
