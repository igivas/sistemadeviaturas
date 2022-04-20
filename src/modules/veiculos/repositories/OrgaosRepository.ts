import { getRepository, Repository } from 'typeorm';
import IOrgaosRepository from '@modules/veiculos/repositories/interfaces/IOrgaosRepository';
import Orgao from '../entities/Orgao';

interface IResponseFindVeiculos {
  total: number;
  totalPage: number;
  items: object[];
}

class OrgaosRepository implements IOrgaosRepository {
  private ormRepository: Repository<Orgao>;

  constructor() {
    this.ormRepository = getRepository(Orgao);
  }

  public async findOrgaos(): Promise<Orgao[]> {
    const orgaos = await this.ormRepository.find({
      order: {
        sigla: 'ASC',
      },
    });

    return orgaos;
  }

  public async findById(id: string): Promise<Orgao | undefined> {
    const orgao = await this.ormRepository.findOne({
      where: {
        id_orgao: id,
      },
    });

    return orgao;
  }
}

export default OrgaosRepository;
