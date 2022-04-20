import { Repository, getRepository } from 'typeorm';
import ISistemasRepository from './interfaces/ISistemasRespository';
import Sistema from '../entities/Sistema';

class SistemasRepository implements ISistemasRepository {
  private sistemasRepository: Repository<Sistema>;

  constructor() {
    this.sistemasRepository = getRepository(Sistema);
  }

  public async findById(id_sistema: number): Promise<Sistema | undefined> {
    const sistema = await this.sistemasRepository.findOne(id_sistema);

    return sistema;
  }
}

export default SistemasRepository;
