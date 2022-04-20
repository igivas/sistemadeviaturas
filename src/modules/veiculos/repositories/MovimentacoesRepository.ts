import {
  Repository,
  getRepository,
  SelectQueryBuilder,
  QueryRunner,
  LessThanOrEqual,
  MoreThan,
  Brackets,
  DeleteResult,
} from 'typeorm';
import IMovimentacoesRepository, {
  IMovimentacoesSearch,
} from './interfaces/IMovimentacoesRepository';
import Movimentacao from '../entities/Movimentacao';
import ETipoMovimentacao from '../enums/ETipoMovimentacao';
import EFase from '../enums/EFase';

export default class MovimentacoesRepository
  implements IMovimentacoesRepository {
  private readonly ormRepository: Repository<Movimentacao>;

  constructor() {
    this.ormRepository = getRepository(Movimentacao);
  }

  public async findVeiculoCarga(
    id_veiculo: number,
    data_movimentacao?: Date,
  ): Promise<Movimentacao | undefined> {
    return this.ormRepository.findOne({
      where: (qb: SelectQueryBuilder<Movimentacao>) => {
        qb.where('movimentacao.id_veiculo = :id_veiculo', { id_veiculo });
        qb.andWhere('movimentacao.tipo_movimentacao  = :tipo_movimentacao', {
          tipo_movimentacao: ETipoMovimentacao.TRANSFERENCIA,
        });
        qb.andWhere(
          'movimentacaoTransferencia.assinado_destino = :assinado_destino',
          { assinado_destino: '1' },
        );

        qb.andWhere('movimentacoesFase.id_tipo_fase = :id_tipo_fase', {
          id_tipo_fase: EFase.Recebimento,
        });

        if (data_movimentacao)
          qb.andWhere('movimentacao.data_movimentacao <= :data_movimentacao', {
            data_movimentacao,
          });
      },
      join: {
        alias: 'movimentacao',
        innerJoinAndSelect: {
          dadoMovimentacaoMudancaVeiculo:
            'movimentacao.dadoMovimentacaoMudancaVeiculo',
          movimentacaoTransferencia:
            'dadoMovimentacaoMudancaVeiculo.movimentacaoTransferencia',
          movimentacoesFase: 'movimentacao.movimentacoesFase',
        },
      },

      order: {
        data_movimentacao: 'DESC',
        criado_em: 'DESC',
      },
    });
  }

  public async findMovimentacoes(
    page: number,
    perPage: number,
    { opms, tipoMovimentacao, fase, pendingSignature }: IMovimentacoesSearch,
    fields?: string[],
    query?: string,
    fieldSort?: string[],
    orderSort?: string[],
  ): Promise<[Movimentacao[], number]> {
    const querySearch = this.ormRepository
      .createQueryBuilder('movimentacoes')
      .innerJoinAndSelect(
        'movimentacoes.dadoMovimentacaoMudancaVeiculo',
        'dadoMovimentacaoMudancaVeiculo',
      )
      .innerJoinAndSelect(
        'movimentacoes.movimentacoesFase',
        'movimentacoesFase',
      )
      .leftJoinAndSelect(
        'dadoMovimentacaoMudancaVeiculo.movimentacaoManutencao',
        'movimentacaoManutencao',
      )
      .leftJoinAndSelect(
        'dadoMovimentacaoMudancaVeiculo.movimentacaoTransferencia',
        'movimentacaoTransferencia',
      )
      .innerJoinAndSelect('movimentacoes.veiculo', 'veiculos')
      .leftJoinAndSelect(
        'veiculos.localizacoes',
        'localizacoes',
        'localizacoes.data_localizacao = (SELECT max(v.data_localizacao) as data_localizacao from sav2.veiculos_localizacoes v where v.id_veiculo = veiculos.id_veiculo)',
      )
      .leftJoinAndSelect(
        'veiculos.identificadores',
        'veiculosIdentificadores',
        `veiculosIdentificadores.data_identificador = (select max (veiculoIdentificador.data_identificador) as data_identificador
          from sav2.veiculos_identificadores as veiculoIdentificador
            where (veiculoIdentificador.data_identificador <= movimentacoes.data_movimentacao)
            AND veiculoIdentificador.id_veiculo = veiculos.id_veiculo)`,
      )
      .leftJoinAndSelect(
        'veiculosIdentificadores.identificador',
        'identificador',
      );

    querySearch.where(
      'movimentacoesFase.id_movimentacao_fase = (select max (mf2.id_movimentacao_fase) as id_movimentacao_fase from sav2.movimentacoes_fases mf2 where movimentacoes.id_movimentacao = mf2.id_movimentacao)',
    );

    if (tipoMovimentacao) {
      querySearch.andWhere(
        'movimentacoes.tipo_movimentacao = :tipoMovimentacao',
        {
          tipoMovimentacao,
        },
      );
    }

    if (fase) {
      querySearch.andWhere(`movimentacoesFase.id_tipo_fase = :fase`, {
        fase,
      });
    }

    if (query && fields) {
      querySearch.andWhere(
        new Brackets(subQb => {
          fields.forEach(field => {
            subQb.orWhere(`LOWER(${field}) ILIKE LOWER('%${query}%')`);
          });
        }),
      );
    }

    if (pendingSignature === '0') {
      if (opms.includes(-1)) {
        querySearch.andWhere(
          `dadoMovimentacaoMudancaVeiculo.assinado_origem = '0'`,
        );

        querySearch.orWhere(`movimentacaoTransferencia.assinado_destino = '0'`);

        querySearch.orWhere(
          `dadoMovimentacaoMudancaVeiculo.assinado_devolucao_origem = '0'`,
        );
        querySearch.orWhere(
          `movimentacaoTransferencia.assinado_devolucao_destino = '0'`,
        );
      }
    } else if (pendingSignature === '1') {
      querySearch.andWhere(
        new Brackets(subQb => {
          subQb.where(
            'dadoMovimentacaoMudancaVeiculo.id_opm_origem IN (:...opms)',
            { opms },
          );
          subQb.orWhere(
            'movimentacaoTransferencia.id_opm_destino IN (:...opms)',
            { opms },
          );

          if (pendingSignature === '1')
            subQb.orWhere(`movimentacoesFase.id_tipo_fase = ${EFase.Recusado}`);
        }),
      );

      if (opms.includes(-1)) {
        querySearch.orWhere(
          new Brackets(subQb => {
            subQb.andWhere(
              new Brackets(subQb2 => {
                subQb2.where(
                  `dadoMovimentacaoMudancaVeiculo.assinado_origem = '1'`,
                );
                subQb2.andWhere(
                  `movimentacaoTransferencia.assinado_destino = '1'`,
                );
              }),
            );

            subQb.orWhere(
              new Brackets(subQb2 => {
                subQb2.where(
                  `dadoMovimentacaoMudancaVeiculo.assinado_devolucao_origem = '1'`,
                );
                subQb2.andWhere(
                  `movimentacaoTransferencia.assinado_devolucao_destino = '1'`,
                );
              }),
            );
          }),
        );
      } else {
        querySearch.andWhere(
          new Brackets(subQb => {
            subQb.where(`dadoMovimentacaoMudancaVeiculo.assinado_origem = '1'`);
            subQb.andWhere(`movimentacaoTransferencia.assinado_destino = '1'`);
          }),
        );

        querySearch.orWhere(
          new Brackets(subQb => {
            subQb.where(
              `dadoMovimentacaoMudancaVeiculo.assinado_devolucao_origem = '1'`,
            );
            subQb.andWhere(
              `movimentacaoTransferencia.assinado_devolucao_destino = '1'`,
            );
          }),
        );
      }
    }

    if (!opms.includes(-1)) {
      querySearch.andWhere(
        new Brackets(subQb => {
          subQb.where(
            'dadoMovimentacaoMudancaVeiculo.id_opm_origem IN (:...opms)',
            { opms },
          );
          subQb.orWhere(
            'movimentacaoTransferencia.id_opm_destino IN (:...opms)',
            { opms },
          );

          if (pendingSignature === '1')
            subQb.orWhere(`movimentacoesFase.id_tipo_fase = ${EFase.Recusado}`);
        }),
      );

      if (!pendingSignature) {
        querySearch.andWhere(
          new Brackets(subQb => {
            subQb.where(
              new Brackets(subQb2 => {
                subQb2.where(
                  `dadoMovimentacaoMudancaVeiculo.assinado_origem = '1'`,
                );

                subQb2.andWhere(
                  'dadoMovimentacaoMudancaVeiculo.id_opm_origem NOT IN (:...opms)',
                  { opms },
                );
              }),
            );

            subQb.orWhere(
              new Brackets(subQb2 => {
                subQb2.where(
                  `dadoMovimentacaoMudancaVeiculo.assinado_origem = '0'`,
                );

                subQb2.andWhere(
                  'dadoMovimentacaoMudancaVeiculo.id_opm_origem IN (:...opms)',
                  { opms },
                );
              }),
            );

            subQb.orWhere(
              new Brackets(subQb2 => {
                subQb2.where(
                  `dadoMovimentacaoMudancaVeiculo.assinado_origem = '1'`,
                );

                subQb2.andWhere(
                  `movimentacaoTransferencia.assinado_destino = '1'`,
                );

                subQb2.andWhere(
                  'dadoMovimentacaoMudancaVeiculo.id_opm_origem IN (:...opms)',
                  { opms },
                );
              }),
            );

            subQb.orWhere(
              new Brackets(subQb2 => {
                subQb2.where(
                  `dadoMovimentacaoMudancaVeiculo.assinado_origem = '1'`,
                );

                subQb2.andWhere(
                  `movimentacaoTransferencia.assinado_destino = '0'`,
                );

                subQb2.andWhere(
                  'dadoMovimentacaoMudancaVeiculo.id_opm_origem IN (:...opms)',
                  { opms },
                );
              }),
            );
          }),
        );
      }

      if (pendingSignature === '0') {
        querySearch.andWhere(
          new Brackets(subQb => {
            subQb.where(
              new Brackets(subQb2 => {
                subQb2.where(
                  `dadoMovimentacaoMudancaVeiculo.assinado_origem = '0'`,
                );

                subQb2.andWhere(
                  'dadoMovimentacaoMudancaVeiculo.id_opm_origem IN (:...opms)',
                  { opms },
                );
              }),
            );

            subQb.orWhere(
              new Brackets(subQb2 => {
                subQb2.where(
                  `dadoMovimentacaoMudancaVeiculo.assinado_origem = '1'`,
                );

                subQb2.andWhere(
                  `movimentacaoTransferencia.assinado_destino = '0'`,
                );

                subQb2.andWhere(
                  'dadoMovimentacaoMudancaVeiculo.id_opm_origem IN (:...opms)',
                  { opms },
                );
              }),
            );

            subQb.orWhere(
              new Brackets(subQb2 => {
                subQb2.where(
                  `dadoMovimentacaoMudancaVeiculo.assinado_origem = '1'`,
                );

                subQb2.andWhere(
                  `movimentacaoTransferencia.assinado_destino = '0'`,
                );

                subQb2.andWhere(
                  'movimentacaoTransferencia.id_opm_destino IN (:...opms)',
                  { opms },
                );
              }),
            );
          }),
        );
      }
    }

    if (
      orderSort &&
      fieldSort &&
      fieldSort.length > 0 &&
      fieldSort.length === orderSort.length
    ) {
      const removedFieldSort = ['opm_origem.sigla', 'opm_destino.sigla'];

      fieldSort.forEach((field, index) => {
        if (!removedFieldSort.includes(field)) {
          if (index === 0)
            querySearch.orderBy(
              field,
              orderSort[index].toUpperCase() as 'ASC' | 'DESC',
            );
          else
            querySearch.addOrderBy(
              field,
              orderSort[index].toUpperCase() as 'ASC' | 'DESC',
            );
        }
      });
    } else querySearch.orderBy('movimentacoes.data_movimentacao', 'DESC');

    if (page && perPage) {
      querySearch.skip(page * perPage - perPage).take(perPage);
    }
    return querySearch.getManyAndCount();
  }

  public async findMovimentacaoAfterDataMovimentacao(
    data_movimentacao: Date,
    id_veiculo: number,
  ): Promise<Movimentacao | undefined> {
    return this.ormRepository.findOne({
      where: {
        data_movimentacao: MoreThan(data_movimentacao),
        id_veiculo,
      },
      order: {
        id_movimentacao: 'DESC',
      },
    });
  }

  public async findActiveMovimentacaoByIdVeiculo(
    id_veiculo: number,
  ): Promise<Movimentacao | undefined> {
    const lastMovimentacao = await this.ormRepository.findOne({
      where: { id_veiculo },
      relations: ['movimentacoesFase'],
    });

    return lastMovimentacao;
  }

  public async findMovimentacaoBeforeOrEqualDataMovimentacao(
    data_movimentacao: Date,
    id_veiculo: number,
  ): Promise<Movimentacao | undefined> {
    return this.ormRepository.findOne({
      where: {
        data_movimentacao: LessThanOrEqual(data_movimentacao),
        id_veiculo,
      },
      order: {
        id_movimentacao: 'DESC',
      },
    });
  }

  public async findLastMovimentacaoByIdVeiculo(
    id_veiculo: number,
  ): Promise<Movimentacao> {
    const movimentacao = await this.ormRepository.findOneOrFail({
      where: {
        id_veiculo,
      },
      order: {
        id_movimentacao: 'DESC',
      },
    });

    return movimentacao;
  }

  public async findAllByIdVeiculo(
    id_veiculo: number,
    page?: number,
    perPage?: number,
  ): Promise<[Movimentacao[], number]> {
    const isPagedAndPerPage =
      page && perPage
        ? {
            skip: page * perPage - perPage,
            take: perPage,
          }
        : {};

    return this.ormRepository.findAndCount({
      where: (qb: SelectQueryBuilder<Movimentacao>) => {
        qb.where('movimentacoes.id_veiculo =:id_veiculo', { id_veiculo })
          .orderBy('movimentacoes.id_movimentacao', 'DESC')
          .addOrderBy('movimentacoesFase.id_movimentacao_fase', 'DESC');
      },

      ...isPagedAndPerPage,

      order: {
        id_movimentacao: 'DESC',
      },

      join: {
        alias: 'movimentacoes',
        innerJoinAndSelect: {
          dadoMovimentacaoMudancaVeiculo:
            'movimentacoes.dadoMovimentacaoMudancaVeiculo',
          movimentacoesFase: 'movimentacoes.movimentacoesFase',
          movimentacaoTransferencia:
            'dadoMovimentacaoMudancaVeiculo.movimentacaoTransferencia',
        },
      },
    });
  }

  public async create(
    movimentacaoData: Movimentacao,
    queryRunner?: QueryRunner,
  ): Promise<Movimentacao> {
    const movimentacao = queryRunner
      ? queryRunner.manager.create(Movimentacao, movimentacaoData)
      : this.ormRepository.create(movimentacaoData);

    return queryRunner
      ? queryRunner.manager.save(movimentacao)
      : this.ormRepository.save(movimentacao);
  }

  public async findById(
    id_movimentacao: number,
    hasRelation?: string[],
  ): Promise<Movimentacao> {
    const movimentcao = await this.ormRepository.findOneOrFail({
      where: {
        id_movimentacao,
      },
      relations: hasRelation,
    });

    return movimentcao;
  }

  public async findAllByIdFases(
    id_movimentacao: number,
  ): Promise<Movimentacao> {
    const movimentacao = await this.ormRepository.findOneOrFail({
      where: {
        id_movimentacao,
      },
      relations: [
        'movimentacoesFase',
        'movimentacoesFase.tipoMovimentacaoFase',
      ],
    });

    return movimentacao;
  }

  async delete(id: number): Promise<DeleteResult> {
    return this.ormRepository.delete({
      id_movimentacao: id,
    });
  }

  public async update(
    movimentacao: Movimentacao,
    newData: Partial<Movimentacao>,
    queryRunner?: QueryRunner,
  ): Promise<Movimentacao | undefined> {
    const veiculoUpdated = queryRunner
      ? queryRunner.manager.merge(Movimentacao, movimentacao, newData)
      : this.ormRepository.merge(movimentacao, newData);

    return queryRunner
      ? queryRunner.manager.save(Movimentacao, veiculoUpdated)
      : this.ormRepository.save(veiculoUpdated);
  }
}
