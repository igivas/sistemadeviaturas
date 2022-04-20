import { getRepository, Repository, Like } from 'typeorm';

import LocalExterno from '../entities/LocalExterno';
import ILocalExternosRepository from './interfaces/ILocaisExternosRepository';

interface IResponseFindLocaisExternos {
  total: number;
  totalPage: number;
  items: LocalExterno[];
}

class LocaisExternosRepository implements ILocalExternosRepository {
  private ormRepository: Repository<LocalExterno>;

  constructor() {
    this.ormRepository = getRepository(LocalExterno);
  }

  public async findAllLocaisExternos(): Promise<LocalExterno[]> {
    const localexternos = await this.ormRepository.find();

    return localexternos;
  }

  public async findLocaisExternos(
    page: number,
    perPage: number,
    query: string,
  ): Promise<IResponseFindLocaisExternos> {
    const whereCustom: object[] = [];

    if (query && query !== '') {
      whereCustom.push({ descricao: Like(`%${String(query)}%`) });
    }

    const [veiculos, total] = await this.ormRepository.findAndCount({
      skip: page * perPage - perPage,
      take: perPage,
      where: whereCustom,
    });

    return {
      total,
      totalPage: Math.ceil(total / Number(perPage)),
      items: veiculos,
    };
  }

  public async findById(id: string): Promise<LocalExterno | undefined> {
    const localexterno = await this.ormRepository.findOne(id);

    return localexterno;
  }

  public async create(localexternoData: object): Promise<LocalExterno> {
    const localexterno = this.ormRepository.create(localexternoData);

    await this.ormRepository.save(localexterno);

    return localexterno;
  }

  public async update(
    local: LocalExterno,
    newData: object,
  ): Promise<LocalExterno> {
    const localUpdated = await this.ormRepository.merge(local, newData);
    return this.ormRepository.save(localUpdated);
  }

  public async destroy(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }
}

export default LocaisExternosRepository;
