import { getRepository, Repository, SelectQueryBuilder } from 'typeorm';

import Usuario from '@modules/seg/entities/Usuario';
import IUsuariosRepository from './interfaces/IUsuariosRepository';

class UsuariosRepository implements IUsuariosRepository {
  private ormRepository: Repository<Usuario>;

  constructor() {
    this.ormRepository = getRepository(Usuario);
  }

  async findAllPMsByIdSistema(): Promise<Usuario[]> {
    return this.ormRepository.find({
      select: ['usu_codigo'],
      where: (qb: SelectQueryBuilder<Usuario>) => {
        qb.where('sistemas_usuarios.sis_codigo = :id_sistema', {
          id_sistema: process.env.ID_SISTEMA,
        });
        qb.andWhere('length(sistemas_usuarios.usu_codigo) < 9');
      },
      join: {
        alias: 'usuarios',
        innerJoinAndSelect: {
          sistemas_usuarios: 'usuarios.sistemas_usuarios',
        },
      },
    });
  }

  public async findById(id: string): Promise<Usuario | undefined> {
    const usuario = await this.ormRepository.findOne(id);

    return usuario;
  }

  public async findByEmail(email: string): Promise<Usuario | undefined> {
    const usuario = await this.ormRepository.findOne({ where: { email } });

    return usuario;
  }

  public async findByMatricula(
    matricula: string,
  ): Promise<Usuario | undefined> {
    const usuario = await this.ormRepository.findOne({
      select: ['usu_email', 'usu_nome', 'usu_senha', 'usu_codigo', 'usu_nivel'],
      where: { usu_codigo: matricula },
    });

    return usuario;
  }
}

export default UsuariosRepository;
