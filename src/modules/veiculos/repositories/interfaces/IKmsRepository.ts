import Km from '@modules/veiculos/entities/Km';
import { IDefaultRepository } from './IDefaultRepository';

export default interface IKmsRepository extends IDefaultRepository<Km> {
  findLastKmByIdVeiculo(id_veiculo: number): Promise<Km>;
  findKms(
    id_veiculo: number,
    page?: number,
    perPage?: number,
  ): Promise<[Km[], number]>;
  findKmVeiculoBeforeDate(
    id_veiculo: number,
    data_situacao: Date,
  ): Promise<Km | undefined>;

  findKmVeiculoAfterDate(
    id_veiculo: number,
    data_situacao: Date,
  ): Promise<Km | undefined>;
}
