import {
  getRepository,
  Repository,
  SelectQueryBuilder,
  Brackets,
} from 'typeorm';
import IUnidadesRepository from './interfaces/IUnidadesRepository';
import Unidade from '../entities/Unidade';

class UnidadesRepository implements IUnidadesRepository {
  private ormRepository: Repository<Unidade>;

  constructor() {
    this.ormRepository = getRepository(Unidade);
  }

  async findByPesCodigo(pes_codigo: string): Promise<Unidade | undefined> {
    return this.ormRepository.findOne({
      where: {
        pes_codigo,
        uni_lob: 2021,
      },
    });
  }

  public async findById(id: number): Promise<Unidade | undefined> {
    const unidade = await this.ormRepository.findOne(id);

    return unidade;
  }

  public async findSubunidades(unidade: number): Promise<Unidade[]> {
    const unidades: Unidade[] = await this.ormRepository.query(
      `
      WITH RECURSIVE subUnidades as (
        SELECT * FROM public.unidade unidades where unidades.uni_lob=2021 AND unidades.uni_codigo = $1
        UNION ALL
        SELECT unidadeFilhas.* from public.unidade unidadeFilhas INNER JOIN subUnidades ON subUnidades.uni_codigo = unidadeFilhas.uni_superior
      ) SELECT * from subUnidades
    `,
      [unidade],
    );

    return unidades;
  }

  public async findUnidades(
    query: string | undefined,
    ids?: number[],
    page?: number,
    perPage?: number,
  ): Promise<[Unidade[], number]> {
    return this.ormRepository.findAndCount({
      select: ['uni_codigo', 'uni_sigla', 'uni_nome'],
      where: (qb: SelectQueryBuilder<Unidade>) => {
        qb.where(
          new Brackets(subQb => {
            subQb.where(
              `LOWER("Unidade"."uni_nome") ILIKE LOWER('%${query}%')`,
            );

            subQb.orWhere(
              `LOWER("Unidade"."uni_sigla") ILIKE LOWER('%${query}%')`,
            );
          }),
        );
        if (ids) {
          qb.andWhere(`"Unidade"."uni_codigo" IN (:...ids)`, { ids });
        } else {
          qb.andWhere(`"Unidade"."uni_lob" = 2021`);
        }
      },
      skip: page && perPage ? page * perPage - perPage : undefined,
      take: page && perPage ? perPage : undefined,
      order: {
        uni_grd_cmdo: 'ASC',
      },
    });
  }

  public async findByIds(ids: number[]): Promise<Unidade[] | undefined> {
    const unidades = await this.ormRepository.findByIds(ids, {
      select: ['uni_codigo', 'uni_sigla', 'uni_nome', 'uni_sigla'],
      where: {
        uni_lob: 2021,
      },
    });

    return unidades;
  }

  public async findAllUnidades(): Promise<Unidade[]> {
    return this.ormRepository.find({
      where: {
        uni_lob: 2021,
      },
    });
  }
}

export default UnidadesRepository;
