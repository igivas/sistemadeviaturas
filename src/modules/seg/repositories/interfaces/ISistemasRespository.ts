import Sistema from '../../entities/Sistema';

export default interface IPerfisRepository {
  findById(id_sistema: number): Promise<Sistema | undefined>;
}
