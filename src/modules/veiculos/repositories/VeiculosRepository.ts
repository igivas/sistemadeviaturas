import {
  getRepository,
  Repository,
  Raw,
  Like,
  SelectQueryBuilder,
  Brackets,
  QueryRunner,
} from 'typeorm';
import IVeiculoRepository from '@modules/veiculos/repositories/interfaces/IVeiculosRepository';
import Veiculo from '../entities/Veiculo';
import { IGetFrota } from '../interfaces/request/IGetFrota';

type FindVeiculos = {
  origem_aquisicao?: string;
  ids_situacoes_veiculos?: number[];
  ids_situacoes_veiculos_especificos?: number[];

  id_modelo?: string;
  ano_fabricacao?: string;
  opms?: number[];
  is_reserva?: '0' | '1';
};

// const optionsOrigemAquisicao = {
//   0: 'Orgânico',
//   1: 'Locado',
//   2: 'Cessão',
// };

// const formatResponseVeiculos = (veiculos: Veiculo[]): object[] => {
//   const resposta = veiculos?.map((veiculo: Veiculo): object => {
//     return {
//       ...veiculo,
//       origem_aquisicao: {
//         value: veiculo.origem_aquisicao,
//         text: optionsOrigemAquisicao[veiculo.origem_aquisicao],
//       },
//     };
//   });
//   return resposta;
// };

class VeiculosRepository implements IVeiculoRepository {
  private ormRepository: Repository<Veiculo>;

  constructor() {
    this.ormRepository = getRepository(Veiculo);
  }

  public async findAllModelosByOpms(
    opms: number[],
    page?: number | undefined,
    perPage?: number | undefined,
  ): Promise<[Pick<Veiculo, 'id_modelo' | 'veiculoModelo'>[], number]> {
    return this.ormRepository.findAndCount({
      select: ['id_modelo'],
      where: (qb: SelectQueryBuilder<Veiculo>) => {
        qb.where(
          `veiculoCarga.opm_carga ${
            opms.includes(-1) ? 'NOT' : ''
          } IN (:...opms)`,
          { opms },
        );
        qb.orderBy('veiculoModelo.nome', 'ASC');
      },
      join: {
        alias: 'veiculos',
        innerJoinAndSelect: {
          veiculoModelo: 'veiculos.veiculoModelo',
        },
        innerJoin: {
          veiculoCarga: 'veiculos.veiculoCarga',
        },
      },
      take: page && perPage ? perPage : undefined,
      skip: page && perPage ? page * perPage - perPage : undefined,
    });
  }

  public async findByChassi(chassi: string): Promise<[Veiculo[], number]> {
    return this.ormRepository.findAndCount({
      where: {
        chassi: Raw(
          chassiDB => `LOWER(${chassiDB}) ILIKE LOWER('%${chassi}%')`,
        ),
      },
      relations: [
        'veiculoMarca',
        'veiculoModelo',
        'veiculoCarga',
        'veiculoCarga.unidade',
        'situacaoTipoAtual',
        'identificadores',
      ],
    });
  }

  public async findByRenavam(renavam: string): Promise<[Veiculo[], number]> {
    return this.ormRepository.findAndCount({
      where: {
        renavam: Like(`%${renavam}%`),
      },
      relations: [
        'veiculoMarca',
        'veiculoModelo',
        'veiculoCarga',
        'veiculoCarga.unidade',
        'situacaoTipoAtual',
        'identificadores',
      ],
    });
  }

  public async findByPlaca(placa: string): Promise<[Veiculo[], number]> {
    return this.ormRepository.findAndCount({
      where: {
        placa: Raw(placaDB => `LOWER(${placaDB}) ILIKE LOWER('%${placa}%')`),
      },
      relations: [
        'veiculoMarca',
        'veiculoModelo',
        'veiculoCarga',
        'veiculoCarga.unidade',
        'situacaoTipoAtual',
        'identificadores',
      ],
    });
  }

  public async findAllVeiculos(): Promise<Veiculo[]> {
    const veiculos = await this.ormRepository.find();

    return veiculos;
  }

  public async findAllAnoFabricacao(opms: number[]): Promise<Veiculo[]> {
    return this.ormRepository.find({
      select: ['ano_fabricacao'],
      where: (qb: SelectQueryBuilder<Veiculo>) => {
        qb.where(
          `veiculoCarga.opm_carga ${
            opms.includes(-1) ? 'NOT' : ''
          } IN (:...opms)`,
          { opms },
        );
      },
      join: {
        alias: 'veiculos',
        innerJoin: {
          veiculoCarga: 'veiculos.veiculoCarga',
        },
      },
      order: {
        ano_fabricacao: 'DESC',
      },
    });
  }

  public async findVeiculos(
    page: number,
    perPage: number,
    query: string,
    options: FindVeiculos,
    fields?: string[],
    fieldSort?: string[],
    orderSort?: string[],
  ): Promise<[Veiculo[], number]> {
    const querySearch = this.ormRepository
      .createQueryBuilder('veiculos')
      .select('veiculos.ano_fabricacao')
      .addSelect([
        'veiculos.placa',
        'veiculos.id_veiculo',
        'veiculos.is_reserva',
      ])
      .innerJoinAndSelect('veiculos.situacaoTipoAtual', 'situacaoTipoAtual')
      .leftJoinAndSelect(
        'veiculos.situacaoTipoEspecificacaoAtual',
        'situacaoTipoEspecificacaoAtual',
      )
      .leftJoinAndSelect(
        'veiculos.localizacoes',
        'localizacoes',
        'localizacoes.data_localizacao = (SELECT max(vl.data_localizacao) from sav2.veiculos_localizacoes vl where vl.id_veiculo = veiculos.id_veiculo)',
      )
      .innerJoinAndSelect('veiculos.veiculoCarga', 'veiculoCarga')
      .innerJoinAndSelect('veiculoCarga.unidade', 'unidade')
      .innerJoinAndSelect('veiculos.veiculoMarca', 'marca')
      .innerJoinAndSelect('veiculos.veiculoModelo', 'modelo')
      .leftJoinAndSelect('veiculos.aquisicoes', 'aquisicoes')
      .innerJoinAndSelect('veiculos.identificadores', 'identificadores')
      .innerJoinAndSelect('identificadores.identificador', 'identificador');

    let hasOtherFields = false;
    if (options) {
      const {
        id_modelo,
        ids_situacoes_veiculos,
        ids_situacoes_veiculos_especificos,
        origem_aquisicao,
        ano_fabricacao,
        opms,
        is_reserva,
      } = options;
      if (id_modelo) {
        querySearch.where('veiculos.id_modelo = :id_modelo', { id_modelo });
        hasOtherFields = true;
      }

      if (ids_situacoes_veiculos) {
        const whereSituacaoAtual = `veiculos.id_situacao_tipo IN (:...ids_situacoes_veiculos)`;
        if (hasOtherFields) {
          querySearch.andWhere(whereSituacaoAtual, { ids_situacoes_veiculos });
        } else {
          querySearch.where(whereSituacaoAtual, { ids_situacoes_veiculos });
        }
        hasOtherFields = true;
      }

      if (ids_situacoes_veiculos_especificos) {
        const whereSituacaoEspecificaAtual = `veiculos.id_situacao_especificacao_atual IN (:...ids_situacoes_veiculos_especificos)`;
        if (hasOtherFields) {
          querySearch.andWhere(whereSituacaoEspecificaAtual, {
            ids_situacoes_veiculos_especificos,
          });
        } else {
          querySearch.where(whereSituacaoEspecificaAtual, {
            ids_situacoes_veiculos_especificos,
          });
        }
        hasOtherFields = true;
      }

      const whereIsReserva = `veiculos.is_reserva = :is_reserva`;
      if (is_reserva) {
        if (is_reserva === '1') {
          if (hasOtherFields) {
            querySearch.andWhere(whereIsReserva, { is_reserva });
          } else {
            querySearch.where(whereIsReserva, { is_reserva });

            hasOtherFields = true;
          }
        } else {
          if (hasOtherFields) {
            querySearch.andWhere(
              new Brackets(subQb => {
                subQb.where(whereIsReserva, { is_reserva });
                subQb.orWhere(`veiculos.is_reserva IS NULL`);
              }),
            );
          } else {
            querySearch.where(
              new Brackets(subQb => {
                subQb.where(whereIsReserva, { is_reserva });

                subQb.orWhere(`veiculos.is_reserva IS NULL`);
              }),
            );
          }
          hasOtherFields = true;
        }
      }

      const queryAquisicao =
        '(SELECT max(aquisicao.data_aquisicao) as data_aquisicao from sav2.aquisicoes aquisicao where aquisicao.id_veiculo = veiculos.id_veiculo)';

      if (hasOtherFields) {
        querySearch.andWhere(`aquisicoes.data_aquisicao = ${queryAquisicao}`);
      } else {
        querySearch.where(`aquisicoes.data_aquisicao = ${queryAquisicao}`);
        hasOtherFields = true;
      }

      if (origem_aquisicao) {
        if (hasOtherFields) {
          querySearch.andWhere(
            'aquisicoes.origem_aquisicao = :origem_aquisicao',
            { origem_aquisicao },
          );
        } else {
          querySearch.where('aquisicoes.origem_aquisicao = :origem_aquisicao', {
            origem_aquisicao,
          });
        }
        hasOtherFields = true;
      }
      if (ano_fabricacao) {
        const whereAnoFab = `veiculos.ano_fabricacao = '${ano_fabricacao}'`;

        if (hasOtherFields) {
          querySearch.andWhere(whereAnoFab);
        } else {
          querySearch.where(whereAnoFab);
        }
        hasOtherFields = true;
      }

      if (opms) {
        const whereOpms = 'veiculoCarga.opm_carga IN (:...opms)';
        if (!opms.includes(-1))
          if (hasOtherFields) {
            querySearch.andWhere(whereOpms, { opms });
          } else {
            querySearch.where(whereOpms, { opms });
          }
      }
      hasOtherFields = true;
    }

    if (query && fields) {
      if (hasOtherFields) {
        querySearch.andWhere(
          new Brackets(subQb => {
            fields.forEach(field => {
              subQb.orWhere(`LOWER(${field}) ILIKE LOWER('%${query}%')`);
            });
          }),
        );
      } else {
        fields.forEach((field, index) => {
          if (index === 0) {
            querySearch.where(`LOWER(${field}) ILIKE LOWER('%${query}%')`);
          } else {
            querySearch.orWhere(`LOWER(${field}) ILIKE LOWER('%${query}%')`);
          }
        });
      }
      hasOtherFields = true;
    }

    if (hasOtherFields) {
      querySearch.andWhere(`identificadores.ativo = '1'`);
    } else {
      querySearch.where(`identificadores.ativo = '1'`);

      hasOtherFields = true;
    }

    if (
      orderSort &&
      fieldSort &&
      fieldSort.length > 0 &&
      fieldSort.length === orderSort.length
    ) {
      const removedFieldSort = ['km', 'identificador'];
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
    } else querySearch.orderBy('veiculos.id_veiculo', 'DESC');

    if (page && perPage) {
      querySearch.skip(page * perPage - perPage).take(perPage);
    }
    return querySearch.getManyAndCount();
  }

  public async findById(id: string): Promise<Veiculo | undefined> {
    const veiculo = await this.ormRepository.findOne({
      where: {
        id_veiculo: id,
      },

      relations: [
        'veiculoCarga',
        'veiculoModelo',
        'referenciasPneus',
        'referenciasPneus.pneu',
        'veiculoOrgao',
      ],
    });

    return veiculo;
  }

  public async create(
    veiculoData: Veiculo,
    queryRunner?: QueryRunner,
  ): Promise<Veiculo> {
    const veiculo = queryRunner
      ? queryRunner.manager.create(Veiculo, veiculoData)
      : this.ormRepository.create(veiculoData);

    const response = queryRunner
      ? await queryRunner.manager.save(veiculo)
      : await this.ormRepository.save(veiculo);

    return response;
  }

  public async delete(veiculo: Veiculo): Promise<Veiculo> {
    const response = await this.ormRepository.remove(veiculo);

    return response;
  }

  public async update(
    veiculo: Veiculo,
    newData: Partial<Veiculo>,
    queryRunner?: QueryRunner,
  ): Promise<Veiculo | undefined> {
    const veiculoUpdated = queryRunner
      ? queryRunner.manager.merge(Veiculo, veiculo, newData)
      : this.ormRepository.merge(veiculo, newData);

    return queryRunner
      ? queryRunner.manager.save(Veiculo, veiculoUpdated)
      : this.ormRepository.save(veiculoUpdated);
  }

  public async countVeiculos({
    aquisicao,
    empregos,
    especies,
    situacao,
    opms,
  }: Omit<IGetFrota, 'situacao' | 'opms'> & {
    situacao: number;
    opms: number[];
  }): Promise<number> {
    const query = this.ormRepository
      .createQueryBuilder('veiculos')
      .innerJoin('veiculos.aquisicoes', 'aquisicoes')
      .innerJoin('veiculos.veiculoCarga', 'veiculoCarga');
    // .innerJoin('veiculos.prefixos', 'prefixos')

    query.where('veiculos.id_veiculo_especie IN(:...especies)', {
      especies,
    });

    query.andWhere('veiculos.id_situacao_tipo = :situacao', { situacao });

    query.andWhere(
      'aquisicoes.id_aquisicao = (select max(aquisicao.id_aquisicao) as id_aquisicao from sav2.aquisicoes aquisicao where aquisicao.origem_aquisicao = :aquisicao and veiculos.id_veiculo = aquisicao.id_veiculo)',
      { aquisicao },
    );

    if (!opms.includes(-1)) {
      query.andWhere('veiculoCarga.opm_carga IN(:...opms)', { opms });
    }
    /* query.groupBy('veiculos.id_veiculo');
    query.addGroupBy('aquisicoes.id_aquisicao');
    query.addGroupBy('veiculoCarga.id_carga'); */

    return query.getCount();
  }

  public async findALlVeiculosMovimentacoesByIdOpm(
    id_opm: number,
    page: number,
    perPage: number,
  ): Promise<{ items: Veiculo[]; total: number; totalPage: number }> {
    const query = this.ormRepository
      .createQueryBuilder('veiculos')
      .innerJoin(
        'veiculos.movimentacoes',
        'movimentacoes',
        'movimentacoes.id_opm_destino = :id_opm',
        { id_opm },
      )
      .innerJoin('movimentacoes.movimentacoesFase', 'movimentacoesFase')
      .innerJoin(
        'movimentacoesFase.tipoMovimentacaoFase',
        'tipoMovimentacaoFase',
        `LOWER (tipoMovimentacaoFase.nome_fase) ILIKE LOWER ('%oferta%')`,
      )
      .where(
        'movimentacoes.id_movimentacao = (select max(m.id_movimentacao) from sav2.movimentacoes m where movimentacoes.id_movimentacao = m.id_movimentacao )',
      );

    const [items, total] =
      page && perPage
        ? await query
            .take(perPage)
            .skip(page * perPage - perPage)
            .getManyAndCount()
        : await query.getManyAndCount();

    return {
      total,
      totalPage: Math.ceil(total / Number(perPage)),
      items,
    };
  }
}

export default VeiculosRepository;
