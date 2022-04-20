import { getRepository, Repository } from 'typeorm';
import VeiculoEspecie from '../entities/VeiculoEspecie';
import IVeiculosEspeciesRepository from './interfaces/IVeiculosEspeciesRepository';

class VeiculosEspeciesRepository implements IVeiculosEspeciesRepository {
  private ormRepository: Repository<VeiculoEspecie>;

  constructor() {
    this.ormRepository = getRepository(VeiculoEspecie);
  }

  public async findByEspecie(
    id_veiculo_especie: number,
  ): Promise<VeiculoEspecie | undefined> {
    const veiculoEspecie = await this.ormRepository.findOne({
      where: { id_veiculo_especie },
    });

    return veiculoEspecie;
  }
}

export default VeiculosEspeciesRepository;
