import Identificador from '../../entities/Identificador';
import { IDefaultRepository } from './IDefaultRepository';

export interface IIdentificadoresRepository
  extends IDefaultRepository<Identificador> {
  findIdentificadorByIdentificador(
    identificador: string,
  ): Promise<Identificador | undefined>;

  findById(id_identificador: number): Promise<Identificador | undefined>;
}
