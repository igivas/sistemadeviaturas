import {
  Brackets,
  getRepository,
  IsNull,
  QueryRunner,
  Raw,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import Oficina from '../entities/Oficina';
import IOficinasRepository from './interfaces/IOficinasRepository';

class OficinasRepository implements IOficinasRepository {
  private ormRepository: Repository<Oficina>;

  constructor() {
    this.ormRepository = getRepository(Oficina);
  }

  async findOficinas(
    fields: string[],
    orderSort: string[],
    fieldsSort: string[],
    page?: number,
    perPage?: number,
    query?: string,
  ): Promise<[Oficina[], number]> {
    return this.ormRepository.findAndCount({
      where: (qb: SelectQueryBuilder<Oficina>) => {
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
      join: {
        alias: 'oficinas',
      },
      take: page && perPage ? perPage : undefined,
      skip: page && perPage ? page * perPage - perPage : undefined,
    });
  }

  async findByName(nome: string): Promise<Oficina | undefined> {
    return this.ormRepository.findOne({
      where: {
        nome: Raw(
          nomeDB => `LOWER(TRIM(${nomeDB})) ilike lower(TRIM('${nome}'))`,
        ),
      },
    });
  }

  async findById(id_oficina: string): Promise<Oficina | undefined> {
    return this.ormRepository.findOne({
      where: {
        id_oficina,
      },
    });
  }

  async create(
    oficinas: Oficina[],
    queryRunner?: QueryRunner,
  ): Promise<Oficina[]> {
    const oficinasToCreate = queryRunner
      ? queryRunner.manager.create(Oficina, oficinas)
      : this.ormRepository.create(oficinas);

    return queryRunner
      ? queryRunner.manager.save(oficinasToCreate)
      : this.ormRepository.save(oficinasToCreate);
  }

  async listMatrizes(): Promise<Oficina[]> {
    return this.ormRepository.find({
      select: ['id_oficina', 'nome'],
      where: {
        id_oficina_pai: IsNull(),
      },
    });
  }
}

export default OficinasRepository;
