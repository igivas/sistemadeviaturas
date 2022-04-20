import Usuario from '../../entities/Usuario';

export default interface IUsuariosRepository {
  findById(id: string): Promise<Usuario | undefined>;
  findByEmail(email: string): Promise<Usuario | undefined>;
  findByMatricula(matricula: string): Promise<Usuario | undefined>;
  findAllPMsByIdSistema(): Promise<Usuario[]>;
}
