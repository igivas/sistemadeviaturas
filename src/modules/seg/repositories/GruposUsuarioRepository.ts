import { Repository, getRepository, In } from 'typeorm';
import IGruposUsuarioRepository from './interfaces/IGruposUsuarioRespository';
import GrupoUsuario from '../entities/GrupoUsuario';
import Grupo from '../entities/Grupo';

class GruposUsuarioRepository implements IGruposUsuarioRepository {
  private grupoUsuarioRepository: Repository<GrupoUsuario>;

  private grupoRepository: Repository<Grupo>;

  constructor() {
    this.grupoUsuarioRepository = getRepository(GrupoUsuario);
    this.grupoRepository = getRepository(Grupo);
  }

  public async findByMatriculaSistema(
    matricula: string,
    sistema: number[],
  ): Promise<Grupo[]> {
    const gruposUsuarios = await this.grupoUsuarioRepository.find({
      where: {
        usu_codigo: matricula,
      },
    });

    if (!gruposUsuarios) {
      return [];
    }

    const grupos = gruposUsuarios.map(item => item.gru_codigo);

    if (grupos.length <= 0) {
      return [];
    }

    const gruposSistema = await this.grupoRepository.find({
      select: ['gru_nome', 'gru_codigo'],
      where: {
        sis_codigo: In(sistema),
        gru_codigo: In(grupos),
      },
    });

    return gruposSistema;
  }
}

export default GruposUsuarioRepository;
