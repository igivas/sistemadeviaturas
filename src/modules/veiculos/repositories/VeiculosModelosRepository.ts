import {
  Brackets,
  getRepository,
  QueryRunner,
  Raw,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import VeiculoModelo from '../entities/VeiculoModelo';
import IVeiculosModelosRepository from './interfaces/IVeiculosModelosRepository';

type FindMarcas = {
  id_veiculo_marca?: number;
  id_veiculo_especie?: number;
  opms?: number[];
  existCarga?: '1';
};

class VeiculosModelosRepository implements IVeiculosModelosRepository {
  private ormRepository: Repository<VeiculoModelo>;

  constructor() {
    this.ormRepository = getRepository(VeiculoModelo);
  }

  async findVeiculosModelos(
    fields: string[],
    orderSort: string[],
    fieldsSort: string[],

    page?: number,
    perPage?: number,
    query?: string,
  ): Promise<[VeiculoModelo[], number]> {
    return this.ormRepository.findAndCount({
      where: (qb: SelectQueryBuilder<VeiculoModelo>) => {
        let hasFields = false;

        if (query && fields.length > 0) {
          if (hasFields) {
            qb.andWhere(
              new Brackets(subQb => {
                fields.forEach(field => {
                  subQb.orWhere(
                    `LOWER(TRIM(${field})) ILIKE LOWER(TRIM('%${query}%'))`,
                  );
                });
              }),
            );
          } else {
            fields.forEach((field, index) => {
              if (index === 0) {
                qb.where(
                  `LOWER(TRIM(${field})) ILIKE LOWER(TRIM('%${query}%'))`,
                );
              } else {
                qb.orWhere(
                  `LOWER(TRIM(${field})) ILIKE LOWER(TRIM('%${query}%'))`,
                );
              }
            });
          }
          hasFields = true;
        }

        if (
          orderSort &&
          fieldsSort &&
          fieldsSort.length > 0 &&
          fieldsSort.length === orderSort.length
        ) {
          const removedFieldSort = ['opm_origem.sigla', 'opm_destino.sigla'];

          fieldsSort.forEach((field, index) => {
            if (!removedFieldSort.includes(field)) {
              if (index === 0)
                qb.orderBy(
                  field,
                  orderSort[index].toUpperCase() as 'ASC' | 'DESC',
                );
              else
                qb.addOrderBy(
                  field,
                  orderSort[index].toUpperCase() as 'ASC' | 'DESC',
                );
            }
          });
        }
      },

      take: page && perPage ? perPage : undefined,
      skip: page && perPage ? page * perPage - perPage : undefined,
    });
  }

  async findByNome(nome: string): Promise<VeiculoModelo | undefined> {
    return this.ormRepository.findOne({
      where: {
        nome: Raw(
          nomeDB => `LOWER(TRIM(${nomeDB})) ilike lower(TRIM('${nome}'))`,
        ),
      },
    });
  }

  public async findById(id: string): Promise<VeiculoModelo | undefined> {
    const modelo = await this.ormRepository.findOne({
      where: {
        id_veiculo_modelo: id,
      },

      relations: ['veiculoMarca', 'veiculoEspecie'],
    });

    return modelo;
  }

  async create(
    veiculos_modelos: VeiculoModelo[],
    queryRunner?: QueryRunner,
  ): Promise<VeiculoModelo[]> {
    const veiculosModelosToCreate = queryRunner
      ? queryRunner.manager.create(VeiculoModelo, veiculos_modelos)
      : this.ormRepository.create(veiculos_modelos);

    return queryRunner
      ? queryRunner.manager.save(veiculosModelosToCreate)
      : this.ormRepository.save(veiculosModelosToCreate);
  }

  public async update(
    modelo: VeiculoModelo,
    newData: Partial<VeiculoModelo>,
  ): Promise<VeiculoModelo | undefined> {
    const modeloUpdate = this.ormRepository.merge(modelo, newData);

    console.log(modelo, modeloUpdate);

    return this.ormRepository.save(modeloUpdate);
  }

  public async findAllVeiculosByOpms(
    opms: number[],
    page?: number | undefined,
    perPage?: number | undefined,
  ): Promise<[VeiculoModelo[], number]> {
    return this.ormRepository.findAndCount({
      where: (qb: SelectQueryBuilder<VeiculoModelo>) => {
        if (!opms.includes(-1))
          qb.where(
            // eslint-disable-next-line prettier/prettier
            `veiculoCarga.opm_carga  IN (:...opms)`,
            { opms },
          );
        qb.orderBy('modelos.nome', 'ASC');
      },
      join: {
        alias: 'modelos',
        leftJoinAndSelect: {
          veiculos: 'modelos.veiculos',
          veiculoCarga: 'veiculos.veiculoCarga',
          marcas: 'modelos.veiculoMarca',
          especies: 'modelos.veiculoEspecie',
        },
      },
      take: page && perPage ? perPage : undefined,
      skip: page && perPage ? page * perPage - perPage : undefined,
    });
  }

  public async findMarcas(
    page: number,
    perPage: number,
    query: string,
    options: FindMarcas,
    fields?: string[],
    fieldSort?: string[],
    orderSort?: string[],
  ): Promise<[VeiculoModelo[], number]> {
    const querySearch = this.ormRepository
      .createQueryBuilder('modelos')

      .innerJoinAndSelect('modelos.veiculoMarca', 'marca')
      .leftJoinAndSelect('modelos.veiculos', 'veiculos')
      .leftJoinAndSelect('veiculos.veiculoCarga', 'veicCarga')
      .innerJoinAndSelect('modelos.veiculoEspecie', 'veiculoEspecie');
    let hasOtherFields = false;
    if (options) {
      // eslint-disable-next-line prettier/prettier
      const { id_veiculo_marca, opms, id_veiculo_especie, existCarga } = options;
      if (id_veiculo_marca) {
        querySearch.where('modelos.id_veiculo_marca = :id_veiculo_marca', {
          id_veiculo_marca,
        });
        hasOtherFields = true;
      }

      if (id_veiculo_especie) {
        querySearch.where('modelos.id_veiculo_especie = :id_veiculo_especie', {
          id_veiculo_especie,
        });
        hasOtherFields = true;
      }

      if (existCarga) {
        if (opms) {
          const whereOpms = `veicCarga.opm_carga IN (:...opms)`;
          if (hasOtherFields) {
            querySearch.andWhere(whereOpms, { opms });
          } else {
            querySearch.where(whereOpms, { opms });
          }
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

    if (
      orderSort &&
      fieldSort &&
      fieldSort.length > 0 &&
      fieldSort.length === orderSort.length
    ) {
      fieldSort.forEach((field, index) => {
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
      });
    } else querySearch.orderBy('modelos.id_veiculo_modelo', 'DESC');

    if (page && perPage) {
      querySearch.skip(page * perPage - perPage).take(perPage);
    }
    return querySearch.getManyAndCount();
  }
}

export default VeiculosModelosRepository;
