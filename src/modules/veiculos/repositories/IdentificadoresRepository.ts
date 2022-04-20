import { getRepository, Repository, Raw, QueryRunner } from 'typeorm';
import { IIdentificadoresRepository } from '@modules/veiculos/repositories/interfaces/IIdentificadoresRepository';
import Identificador from '../entities/Identificador';

class IdentificadoresRepository implements IIdentificadoresRepository {
  private ormRepository: Repository<Identificador>;

  constructor() {
    this.ormRepository = getRepository(Identificador);
  }

  findById(id_identificador: number): Promise<Identificador | undefined> {
    return this.ormRepository.findOne({
      where: {
        id_identificador,
      },
    });
  }

  public async create(
    identificadorData: Identificador,
    queryRunner?: QueryRunner,
  ): Promise<Identificador> {
    const identificador = queryRunner
      ? queryRunner.manager.create(Identificador, identificadorData)
      : this.ormRepository.create(identificadorData);

    return queryRunner
      ? queryRunner.manager.save(identificador)
      : this.ormRepository.save(identificador);
  }

  public async update(
    identificador: Identificador,
    newData: any,
    queryRunner?: QueryRunner,
  ): Promise<Identificador | undefined> {
    throw new Error('Method not implemented.');
  }

  public async findIdentificadorByIdentificador(
    identificador: string,
  ): Promise<Identificador | undefined> {
    return this.ormRepository.findOne({
      where: {
        identificador: Raw(
          identificadorDB =>
            `UPPER(${identificadorDB}) LIKE UPPER('${identificador}')`,
        ),
      },
    });
  }
}

export default IdentificadoresRepository;
