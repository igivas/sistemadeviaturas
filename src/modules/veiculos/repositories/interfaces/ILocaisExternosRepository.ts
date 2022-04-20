import LocalExterno from '../../entities/LocalExterno';
import { IDefaultRepository } from './IDefaultRepository';

export default interface ILocalExternosRepository
  extends IDefaultRepository<LocalExterno> {
  findById(id: string): Promise<LocalExterno | undefined>;
  findAllLocaisExternos(): Promise<LocalExterno[]>;
  findLocaisExternos(
    page: number,
    perPage: number,
    query: string,
  ): Promise<{ total: number; totalPage: number; items: LocalExterno[] }>;

  destroy(id: string): Promise<void>;
}
