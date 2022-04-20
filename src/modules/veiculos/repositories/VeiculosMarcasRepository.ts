import { getRepository, Repository } from 'typeorm';
import VeiculoMarca from '../entities/VeiculoMarca';
import IVeiculosMarcasRepository from './interfaces/IVeiculosMarcasRepository';

class VeiculosMarcasRepository implements IVeiculosMarcasRepository {
  private ormRepository: Repository<VeiculoMarca>;

  constructor() {
    this.ormRepository = getRepository(VeiculoMarca);
  }

  public async findByMarca(
    id_veiculo_marca: number,
  ): Promise<VeiculoMarca | undefined> {
    const veiculoMarca = await this.ormRepository.findOne({
      where: { id_veiculo_marca },
    });

    return veiculoMarca;
  }
}

export default VeiculosMarcasRepository;
