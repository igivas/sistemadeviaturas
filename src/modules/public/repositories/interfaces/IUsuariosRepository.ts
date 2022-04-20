import Usuario from '@modules/public/entities/Usuario';

export default interface IUsuariosSegRepository {
  findByCpf(cpf: string): Promise<Usuario | undefined>;
  findEmailByUsoCodigoAndEmail(
    cpf: string,
    email: string,
  ): Promise<Usuario | undefined>;
}
