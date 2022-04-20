import Grupo from '@modules/seg/entities/Grupo';

export default interface IGruposUsuarioRepository {
  findByMatriculaSistema(
    matricula: string,
    sistema: number[],
  ): Promise<Grupo[]>;
}
