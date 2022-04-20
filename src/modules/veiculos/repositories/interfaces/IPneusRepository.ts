import Pneu from '../../entities/Pneu';
import { IDefaultRepository } from './IDefaultRepository';

export default interface IPneusRepository extends IDefaultRepository<Pneu> {
  findById(id: string): Promise<Pneu | undefined>;
  findReferencias(id_veiculo_especie?: number): Promise<Pneu[]>;
  findReferenciasByIds(idPneus: number[]): Promise<Pneu[]>;
  findReferenciasByDesc(referencia: string): Promise<Pneu | undefined>;
  // findAllVeiculos(): Promise<Veiculo[]>;
  // create(data: object): Promise<Veiculo>;
  // update(veiculo: Veiculo, newData: object): Promise<Veiculo>;
}
