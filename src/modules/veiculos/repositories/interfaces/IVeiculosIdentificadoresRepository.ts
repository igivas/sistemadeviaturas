import VeiculoIdenficador from '@modules/veiculos/entities/VeiculoIdentificador';
import { IDefaultRepository } from './IDefaultRepository';

export interface IVeiculosIdentificadoresRepository
  extends IDefaultRepository<VeiculoIdenficador> {
  findLastIdentificadorByVeiculoId(
    id_veiculo: number,
  ): Promise<VeiculoIdenficador | undefined>;

  findLastIdentificadorByIdIdentificador(
    id_identificador: number,
  ): Promise<VeiculoIdenficador | undefined>;

  findVeiculoIdentificadorByIdVeiculoAndIdIdentificador(
    id_veiculo: number,
    id_identificador: number,
  ): Promise<VeiculoIdenficador | undefined>;

  findAllByIdVeiculo(
    id_veiculo: number,
    page?: number,
    perPage?: number,
  ): Promise<[VeiculoIdenficador[], number]>;

  findVeiculoIdentificadorBeforeDateAndIdVeiculo(
    id_veiculo: number,
    data_identificador: Date,
  ): Promise<VeiculoIdenficador | undefined>;

  findVeiculoIdentificadorAfterDateAndIdVeiculo(
    id_veiculo: number,
    data_identificador: Date,
  ): Promise<VeiculoIdenficador | undefined>;
}
