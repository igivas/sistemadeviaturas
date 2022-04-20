import {
  getRepository,
  Repository,
  QueryRunner,
  LessThanOrEqual,
  MoreThanOrEqual,
} from 'typeorm';
import IKmsRepository from './interfaces/IKmsRepository';
import Km from '../entities/Km';

export default class KmsRepository implements IKmsRepository {
  private ormRepository: Repository<Km>;

  constructor() {
    this.ormRepository = getRepository(Km);
  }

  async findKmVeiculoBeforeDate(
    id_veiculo: number,
    data_situacao: Date,
  ): Promise<Km | undefined> {
    return this.ormRepository.findOne({
      where: {
        id_veiculo,
        data_km: LessThanOrEqual(data_situacao),
      },
      order: {
        data_km: 'DESC',
        km_atual: 'DESC',
        criado_em: 'DESC',
      },
    });
  }

  async findKmVeiculoAfterDate(
    id_veiculo: number,
    data_situacao: Date,
  ): Promise<Km | undefined> {
    return this.ormRepository.findOne({
      where: {
        id_veiculo,
        data_km: MoreThanOrEqual(data_situacao),
      },
      order: {
        data_km: 'ASC',
        km_atual: 'DESC',
        criado_em: 'DESC',
      },
    });
  }

  async create(data: Km, queryRunner?: QueryRunner): Promise<Km> {
    const km = queryRunner
      ? queryRunner.manager.create(Km, data)
      : this.ormRepository.create(data);

    return queryRunner
      ? queryRunner.manager.save(km)
      : this.ormRepository.save(km);
  }

  async update(oldValue: Km, newData: object): Promise<Km> {
    throw new Error('Method not implemented.');
  }

  async findLastKmByIdVeiculo(id_veiculo: number): Promise<Km> {
    return this.ormRepository.findOneOrFail({
      where: {
        id_veiculo,
      },
      order: {
        data_km: 'DESC',
        km_atual: 'DESC',
        criado_em: 'DESC',
      },
    });
  }

  async findKms(
    id_veiculo: number,
    page?: number,
    perPage?: number,
  ): Promise<[Km[], number]> {
    return this.ormRepository.findAndCount({
      where: {
        id_veiculo,
      },
      order: {
        data_km: 'DESC',
        criado_em: 'DESC',
      },
      take: page && perPage ? perPage : undefined,
      skip: page && perPage ? page * perPage - perPage : undefined,
    });
  }
}
