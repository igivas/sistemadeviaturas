import VeiculoModelo from '../../entities/VeiculoModelo';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { IDefaultRepository } from './IDefaultRepository';

type FindMarcas = {
  id_veiculo_marca?: number;
  id_veiculo_especie?: number;
  opms?: number[];
  existCarga?: '1';
};

export default interface IVeiculosModelosRepository
  extends IDefaultRepository<VeiculoModelo> {
  findById(id: string): Promise<VeiculoModelo | undefined>;
  findVeiculosModelos(
    fields: string[],
    orderSort: string[],
    fieldSort: string[],
    page?: number,
    perPage?: number,
    query?: string,
  ): Promise<[VeiculoModelo[], number]>;
  findByNome(nome: string): Promise<VeiculoModelo | undefined>;
  /*
  create(
    veiculos_modelos: VeiculoModelo[],
    queryRunner?: QueryRunner,
  ): Promise<VeiculoModelo[]>; */

  findAllVeiculosByOpms(
    opms: number[],
    page?: number,
    perPage?: number,
  ): Promise<[VeiculoModelo[], number]>;

  /*
  findMarcas(
    opms: number[],
  ): Promise<
    [Pick<VeiculoModelo, 'id_veiculo_marca' | 'veiculoMarca'>[], number]
  >; */

  findMarcas(
    page: number,
    perPage: number,
    query: string,
    options: FindMarcas,
    fields?: string[],
    fieldSort?: string[],
    orderSort?: string[],
  ): Promise<[VeiculoModelo[], number]>;
}
