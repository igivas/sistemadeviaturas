import Unidade from '../../entities/Unidade';

export default interface IUnidadesRepository {
  findById(id: number): Promise<Unidade | undefined>;
  findSubunidades(unidade: number): Promise<Unidade[]>;
  findUnidades(
    query: string | undefined,
    ids?: number[],
    page?: number,
    perPage?: number,
  ): Promise<[Unidade[], number]>;
  findByIds(ids: number[]): Promise<Unidade[] | undefined>;
  findByPesCodigo(pes_codigo: string): Promise<Unidade | undefined>;
}
