export default interface IUsuariosUnidadesRepository {
  findIdsUnidadesByPesCodigo(pes_codigo: string): Promise<number[]>;
}
