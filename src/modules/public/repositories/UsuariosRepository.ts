import { getRepository, Repository } from 'typeorm';
import IUsuariosRepository from './interfaces/IUsuariosRepository';
import Usuario from '../entities/Usuario';

class UsuariosRepository implements IUsuariosRepository {
  private ormRepository: Repository<Usuario>;

  constructor() {
    this.ormRepository = getRepository(Usuario);
  }

  public async findByCpf(cpf: string): Promise<Usuario | undefined> {
    const usuario = await this.ormRepository.findOne({
      where: {
        usu_codigo: cpf,
      },
    });

    return usuario;
  }

  public async findEmailByUsoCodigoAndEmail(
    cpf: string,
    email: string,
  ): Promise<Usuario | undefined> {
    const usuario = await this.ormRepository.findOne({
      where: {
        usu_codigo: cpf,
        usu_email: email,
      },
    });

    return usuario;
  }
}

export default UsuariosRepository;
