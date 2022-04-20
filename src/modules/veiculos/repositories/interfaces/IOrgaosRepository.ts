import Orgao from '../../entities/Orgao';

export default interface IOrgaosRepository {
  findById(id: string): Promise<Orgao | undefined>;
  findOrgaos(): Promise<Orgao[]>;
}
