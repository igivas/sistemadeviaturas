import { getRepository, Repository, QueryRunner } from 'typeorm';
import IAquisicoesRepository from '@modules/veiculos/repositories/interfaces/IAquisicoesRepository';
import Aquisicao from '../entities/Aquisicao';

class AquisicoesRepository implements IAquisicoesRepository {
  private ormRepository: Repository<Aquisicao>;

  constructor() {
    this.ormRepository = getRepository(Aquisicao);
  }

  async findAllByIdVeiculo(id_veiculo: number): Promise<Aquisicao[]> {
    return this.ormRepository.find({
      where: {
        id_veiculo,
      },
    });
  }

  async findLastVeiculoAquisicao(
    id_veiculo: number,
  ): Promise<Aquisicao | undefined> {
    return this.ormRepository.findOne({
      where: {
        id_veiculo,
      },
      order: {
        data_aquisicao: 'DESC',
        id_aquisicao: 'DESC',
      },
    });
  }

  async findById(id: number): Promise<Aquisicao | undefined> {
    const aquisicao = await this.ormRepository.findOne({
      where: {
        id_aquisicao: id,
      },
    });

    return aquisicao;
  }

  public async create(
    aquisicaoData: Aquisicao,
    queryRunner?: QueryRunner,
  ): Promise<Aquisicao> {
    const aquisicao = queryRunner
      ? queryRunner.manager.create(Aquisicao, aquisicaoData)
      : this.ormRepository.create(aquisicaoData);

    return queryRunner
      ? queryRunner.manager.save(aquisicao)
      : this.ormRepository.save(aquisicao);
  }

  public async update(
    aquisicao: Aquisicao,
    newData: Partial<Aquisicao>,
    queryRunner?: QueryRunner,
  ): Promise<Aquisicao | undefined> {
    const aquisicaoUpdated = queryRunner
      ? queryRunner.manager.merge(Aquisicao, aquisicao, newData)
      : this.ormRepository.merge(aquisicao, newData);

    return queryRunner
      ? queryRunner.manager.save(Aquisicao, aquisicaoUpdated)
      : this.ormRepository.save(aquisicaoUpdated);
  }
}

export default AquisicoesRepository;
