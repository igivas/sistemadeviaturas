import { getRepository, Repository } from 'typeorm';
import Municipio from '../entities/Municipio';
import { IMunicipiosRepository } from './interfaces/IMunicipiosRepository';

class MunicipiosRepository implements IMunicipiosRepository {
  private ormRepository: Repository<Municipio>;

  constructor() {
    this.ormRepository = getRepository(Municipio);
  }

  async findByUf(uf: string): Promise<Municipio[]> {
    return this.ormRepository.find({
      where: {
        id_uf: uf,
      },
    });
  }
}

export default MunicipiosRepository;
