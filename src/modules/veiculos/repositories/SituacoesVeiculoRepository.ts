import {
  Repository,
  getRepository,
  SelectQueryBuilder,
  QueryRunner,
  LessThanOrEqual,
  MoreThan,
} from 'typeorm';
import ISituacoesRepository from './interfaces/ISituacoesRepository';
import SituacaoVeiculo from '../entities/SituacaoVeiculo';

export default class SituacoesVeiculoRepository
  implements ISituacoesRepository {
  private ormRepository: Repository<SituacaoVeiculo>;

  constructor() {
    this.ormRepository = getRepository(SituacaoVeiculo);
  }

  async findSituacoesVeiculoBeforeDate(
    id_veiculo: number,
    data_situacao: Date,
  ): Promise<SituacaoVeiculo | undefined> {
    return this.ormRepository.findOne({
      where: {
        id_veiculo,
        data_situacao: LessThanOrEqual(data_situacao),
      },
      order: {
        data_situacao: 'DESC',
        criado_em: 'DESC',
      },
    });
  }

  async findSituacoesVeiculoAfterDate(
    id_veiculo: number,
    data_situacao: Date,
  ): Promise<SituacaoVeiculo | undefined> {
    return this.ormRepository.findOne({
      where: {
        id_veiculo,
        data_situacao: MoreThan(data_situacao),
      },
      order: {
        data_situacao: 'ASC',
        criado_em: 'ASC',
      },
    });
  }

  public async findLastByIdVeiculo(
    id_veiculo: number,
  ): Promise<SituacaoVeiculo> {
    const situacaoAtual = await this.ormRepository.findOneOrFail({
      where: {
        id_veiculo,
      },
      order: {
        id_situacao_veiculo: 'DESC',
      },
    });
    return situacaoAtual;
  }

  public async findById(id: number): Promise<SituacaoVeiculo | undefined> {
    throw new Error('Method not implemented.');
  }

  async findActiveSituacaoByIdSituacao(
    id_situacao_veiculo: number,
  ): Promise<SituacaoVeiculo | undefined> {
    const situacao = await this.ormRepository.findOne({
      where: (qb: SelectQueryBuilder<SituacaoVeiculo>) => {
        qb.where('situacaoVeiculo.id_situacao_veiculo = :id_situacao_veiculo', {
          id_situacao_veiculo,
        }).andWhere(`LOWER(situacaoTipo.nome) ILIKE LOWER('%operando%')`);
      },
      join: {
        alias: 'situacaoVeiculo',
        innerJoin: {
          situacaoTipo: 'situacaoVeiculo.situacaoTipo',
        },
      },
    });

    return situacao || undefined;
  }

  public async findByVeiculoId(
    id_veiculo: number,
    page?: number,
    perPage?: number,
  ): Promise<{
    total: number;
    totalPage: number;
    situacoes: SituacaoVeiculo[];
  }> {
    const isNotPagedAndNotPerPage = !page && !perPage;

    let situacoesVeiculoResponse;

    if (page && perPage)
      situacoesVeiculoResponse = await this.ormRepository.findAndCount({
        where: { id_veiculo },
        order: {
          data_situacao: 'DESC',
          criado_em: 'DESC',
        },
        relations: ['situacoes.id_situacao_tipo', 'kmSituacao'],
        skip: page * perPage - perPage,
        take: perPage,
      });
    else
      situacoesVeiculoResponse = await this.ormRepository.findAndCount({
        where: { id_veiculo },
        order: {
          data_situacao: 'DESC',
          criado_em: 'DESC',
          kmSituacao: 'DESC',
        },
        relations: ['situacaoTipo', 'kmSituacao'],
      });

    const [situacoes, total] = situacoesVeiculoResponse;

    if (isNotPagedAndNotPerPage) return { total, totalPage: 0, situacoes };

    return {
      total,
      totalPage: Math.ceil(total / Number(perPage)),
      situacoes,
    };
  }

  public async create(
    situacaoData: SituacaoVeiculo,
    queryRunner?: QueryRunner,
  ): Promise<SituacaoVeiculo> {
    const situacaoVeiculo = queryRunner
      ? queryRunner.manager.create(SituacaoVeiculo, situacaoData)
      : this.ormRepository.create(situacaoData);
    return queryRunner
      ? queryRunner.manager.save(situacaoVeiculo)
      : this.ormRepository.save(situacaoVeiculo);
  }

  public async update(
    oldValue: SituacaoVeiculo,
    newData: object,
    queryRunner?: QueryRunner,
  ): Promise<SituacaoVeiculo | undefined> {
    throw new Error('Method not implemented.');
  }
}
