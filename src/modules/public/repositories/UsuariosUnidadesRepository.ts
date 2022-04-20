import {
  getRepository,
  Repository,
  SelectQueryBuilder,
  Brackets,
} from 'typeorm';
import IUsuariosUnidadesRepository from './interfaces/IUsuariosUnidadesRepository';
import UsuarioUnidade from '../entities/UsuarioUnidade';

class UsuariosUnidadesRepository implements IUsuariosUnidadesRepository {
  private ormRepository: Repository<UsuarioUnidade>;

  constructor() {
    this.ormRepository = getRepository(UsuarioUnidade);
  }

  public async findIdsUnidadesByPesCodigo(
    pes_codigo: string,
  ): Promise<number[]> {
    const unidades = await this.ormRepository.find({
      where: (qb: SelectQueryBuilder<UsuarioUnidade>) => {
        qb.where('usuariosUnidade.usu_codigo = :pes_codigo', { pes_codigo });
        qb.andWhere(`usuariosUnidade.sis_codigo = ${process.env.ID_SISTEMA}`);

        qb.andWhere(
          new Brackets(subQb => {
            subQb.andWhere('unidade.uni_lob = 2021');
            subQb.orWhere('usuariosUnidade.uni_codigo = -1');
          }),
        );
      },
      join: {
        alias: 'usuariosUnidade',
        innerJoin: {
          unidade: 'usuariosUnidade.unidade',
        },
      },
    });

    const ids = unidades ? unidades.map(uni => uni.uni_codigo) : [];

    return ids;
  }
}

export default UsuariosUnidadesRepository;
