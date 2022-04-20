import { getRepository, QueryRunner, Repository } from 'typeorm';
import VeiculoPneu from '../entities/VeiculoPneu';
import { IVeiculosPneusRepository } from './interfaces/IVeiculosPneusRepository';

class VeiculosPneusRepository implements IVeiculosPneusRepository {
  private ormRepository: Repository<VeiculoPneu>;

  constructor() {
    this.ormRepository = getRepository(VeiculoPneu);
  }

  async findVeiculoPneusByIdVeiculo(
    id_veiculo: number,
  ): Promise<VeiculoPneu[]> {
    return this.ormRepository.find({
      where: {
        id_veiculo,
      },
    });
  }

  async create(
    veiculoPneus: VeiculoPneu[],
    queryRunner?: QueryRunner,
  ): Promise<VeiculoPneu[]> {
    const pneus = queryRunner
      ? queryRunner.manager.create(VeiculoPneu, veiculoPneus)
      : this.ormRepository.create(veiculoPneus);

    const response = queryRunner
      ? await queryRunner.manager.save(pneus)
      : await this.ormRepository.save(pneus);

    return response;
  }

  update(
    oldValue: VeiculoPneu[],
    newData: VeiculoPneu[],
    queryRunner?: QueryRunner,
  ): Promise<VeiculoPneu[] | undefined> {
    const veiculosPneusUpdated = newData.reduce((previous, actualPneu) => {
      const indexValue = oldValue.findIndex(
        old =>
          old.id_veiculo === actualPneu.id_veiculo &&
          old.id_referencia_pneu === actualPneu.id_referencia_pneu,
      );

      const { atualizado_por } = actualPneu;

      const test = queryRunner
        ? queryRunner.manager.merge(VeiculoPneu, oldValue[indexValue], {
            atualizado_por,
          })
        : this.ormRepository.merge(oldValue[indexValue], {
            atualizado_por,
          });

      if (indexValue > -1) {
        return [...previous, test];
      }
      return [...previous];
    }, [] as VeiculoPneu[]);

    return queryRunner
      ? queryRunner.manager.save(VeiculoPneu, veiculosPneusUpdated)
      : this.ormRepository.save(veiculosPneusUpdated);
  }

  async delete(pneus: VeiculoPneu[]): Promise<VeiculoPneu[]> {
    return this.ormRepository.remove(pneus);
  }
}

export default VeiculosPneusRepository;
