import {
  Repository,
  getRepository,
  QueryRunner,
  MoreThanOrEqual,
  LessThanOrEqual,
} from 'typeorm';
import { IVeiculosIdentificadoresRepository } from './interfaces/IVeiculosIdentificadoresRepository';
import VeiculoIdenficador from '../entities/VeiculoIdentificador';

class VeiculosIdentificadoresRepository
  implements IVeiculosIdentificadoresRepository {
  private ormRepository: Repository<VeiculoIdenficador>;

  constructor() {
    this.ormRepository = getRepository(VeiculoIdenficador);
  }

  findVeiculoIdentificadorBeforeDateAndIdVeiculo(
    id_veiculo: number,
    data_identificador: Date,
  ): Promise<VeiculoIdenficador | undefined> {
    return this.ormRepository.findOne({
      where: {
        id_veiculo,
        data_identificador: LessThanOrEqual(data_identificador),
      },
      order: {
        ativo: 'DESC',
        data_identificador: 'DESC',
        id_veiculo_idenficador: 'DESC',
      },
    });
  }

  findVeiculoIdentificadorAfterDateAndIdVeiculo(
    id_veiculo: number,
    data_identificador: Date,
  ): Promise<VeiculoIdenficador | undefined> {
    return this.ormRepository.findOne({
      where: {
        id_veiculo,
        data_identificador: MoreThanOrEqual(data_identificador),
      },
      order: {
        ativo: 'DESC',
        data_identificador: 'DESC',
        id_veiculo_idenficador: 'DESC',
      },
    });
  }

  async create(
    data: VeiculoIdenficador,
    queryRunner?: QueryRunner,
  ): Promise<VeiculoIdenficador> {
    const veiculoIdenficador = queryRunner
      ? queryRunner.manager.create(VeiculoIdenficador, data)
      : this.ormRepository.create(data);

    return queryRunner
      ? queryRunner.manager.save(veiculoIdenficador)
      : this.ormRepository.save(veiculoIdenficador);
  }

  async update(
    oldValue: VeiculoIdenficador,
    newData: Partial<VeiculoIdenficador>,
    queryRunner?: QueryRunner,
  ): Promise<VeiculoIdenficador | undefined> {
    const updatedVeiculoIdentificador = queryRunner
      ? queryRunner.manager.merge(VeiculoIdenficador, oldValue, newData)
      : this.ormRepository.merge(oldValue, newData);

    return queryRunner
      ? queryRunner.manager.save(updatedVeiculoIdentificador)
      : this.ormRepository.save(updatedVeiculoIdentificador);
  }

  public async findLastIdentificadorByVeiculoId(
    id_veiculo: number,
  ): Promise<VeiculoIdenficador | undefined> {
    return this.ormRepository.findOne({
      where: { id_veiculo, ativo: '1' },
      order: { id_veiculo_idenficador: 'DESC' },
    });
  }

  public async findLastIdentificadorByIdIdentificador(
    id_identificador: number,
  ): Promise<VeiculoIdenficador | undefined> {
    return this.ormRepository.findOne({
      where: { id_identificador },
      order: {
        id_veiculo_idenficador: 'DESC',
      },
    });
  }

  public async findVeiculoIdentificadorByIdVeiculoAndIdIdentificador(
    id_veiculo: number,
    id_identificador: number,
  ): Promise<VeiculoIdenficador | undefined> {
    return this.ormRepository.findOne({
      where: { id_veiculo, id_identificador },
    });
  }

  public async findAllByIdVeiculo(
    id_veiculo: number,
    page?: number,
    perPage?: number,
  ): Promise<[VeiculoIdenficador[], number]> {
    const pagination =
      page && perPage
        ? {
            take: page * perPage - perPage,
            skip: page,
          }
        : {};
    return this.ormRepository.findAndCount({
      where: {
        id_veiculo,
      },
      relations: ['identificador'],
      order: {
        data_identificador: 'DESC',
        criado_em: 'DESC',
      },
      ...pagination,
    });
  }
}

export default VeiculosIdentificadoresRepository;
