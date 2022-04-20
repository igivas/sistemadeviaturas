import { Repository, getRepository, QueryRunner } from 'typeorm';
import { IManutencoesOficinasRepository } from './interfaces/IManutencoesOficinasRepository';
import ManutencaoOficina from '../entities/ManutencaoOficina';

class ManutencoesOficinasRepository implements IManutencoesOficinasRepository {
  private readonly ormRepository: Repository<ManutencaoOficina>;

  constructor() {
    this.ormRepository = getRepository(ManutencaoOficina);
  }

  create(
    manutencaoOficinaData: ManutencaoOficina,
    queryRunner?: QueryRunner,
  ): Promise<ManutencaoOficina> {
    const manutencaoOficina = queryRunner
      ? queryRunner.manager.create(ManutencaoOficina, manutencaoOficinaData)
      : this.ormRepository.create(manutencaoOficinaData);

    return queryRunner
      ? queryRunner.manager.save(manutencaoOficina)
      : this.ormRepository.save(manutencaoOficina);
  }

  update(
    oldValue: ManutencaoOficina,
    newData: Partial<ManutencaoOficina>,
    queryRunner?: import('typeorm').QueryRunner | undefined,
  ): Promise<ManutencaoOficina | undefined> {
    throw new Error('Method not implemented.');
  }
}

export default ManutencoesOficinasRepository;
