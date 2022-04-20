import { getRepository, QueryRunner, Repository } from 'typeorm';
import GrupoEmail from '../entities/GrupoEmail';
import { IGruposEmailsRepository } from './interfaces/IGruposEmailsRepository';

class GruposEmailsRepository implements IGruposEmailsRepository {
  private ormRepository: Repository<GrupoEmail>;

  constructor() {
    this.ormRepository = getRepository(GrupoEmail);
  }

  async findAllByIdGrupo(
    id_grupo: number,
    page?: number,
    perPage?: number,
  ): Promise<[GrupoEmail[], number]> {
    return this.ormRepository.findAndCount({
      where: {
        id_grupo,
      },
      relations: ['email'],
      take: page && perPage ? perPage : undefined,
      skip: page && perPage ? page * perPage - perPage : undefined,
    });
  }

  async create(
    data: GrupoEmail[],
    queryRunner?: QueryRunner,
  ): Promise<GrupoEmail[]> {
    const grupoEmail = queryRunner
      ? queryRunner.manager.create(GrupoEmail, data)
      : this.ormRepository.create(data);

    return queryRunner
      ? queryRunner.manager.save(grupoEmail)
      : this.ormRepository.save(grupoEmail);
  }

  async update(
    oldValue: GrupoEmail,
    newData: Partial<GrupoEmail>,
    queryRunner?: QueryRunner,
  ): Promise<GrupoEmail> {
    const updatedEmail = queryRunner
      ? queryRunner.manager.merge(GrupoEmail, oldValue, newData)
      : this.ormRepository.merge(oldValue, newData);

    return queryRunner
      ? queryRunner.manager.save(updatedEmail)
      : this.ormRepository.save(updatedEmail);
  }
}

export default GruposEmailsRepository;
