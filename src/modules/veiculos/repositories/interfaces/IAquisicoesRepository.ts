import Aquisicao from '../../entities/Aquisicao';
import { IDefaultRepository } from './IDefaultRepository';

export default interface IAquisicoesRepository
  extends IDefaultRepository<Aquisicao> {
  findById(id: number): Promise<Aquisicao | undefined>;
  findAllByIdVeiculo(id_veiculo: number): Promise<Aquisicao[]>;
  findLastVeiculoAquisicao(id_veiculo: number): Promise<Aquisicao | undefined>;
}
