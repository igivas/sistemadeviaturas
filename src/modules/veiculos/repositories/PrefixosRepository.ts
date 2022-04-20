import { getRepository, Repository, QueryRunner } from 'typeorm';
import { IPrefixoRepository } from '@modules/veiculos/repositories/interfaces/IPrefixosRepository';
import Prefixo from '../entities/Prefixo';

class PrefixosRepository implements IPrefixoRepository {
  constructor() {}

  public async create(
    prefixoData: Prefixo,
    queryRunner?: QueryRunner,
  ): Promise<Prefixo> {
    throw new Error('Method not implemented.');
  }

  public async update(
    prefixo: Prefixo,
    newData: any,
    queryRunner?: QueryRunner,
  ): Promise<Prefixo | undefined> {
    throw new Error('Method not implemented.');
  }
}

export default PrefixosRepository;
