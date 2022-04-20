import { getRepository, Raw, Repository } from 'typeorm';
import Endereco from '../entities/Endereco';
import { IEnderecosRepository } from './interfaces/IEnderecosRepository';

class EnderecosRepository implements IEnderecosRepository {
  private ormRepository: Repository<Endereco>;

  constructor() {
    this.ormRepository = getRepository(Endereco);
  }

  async findByMunicipio(
    id_municipio: string,
    endereco?: string,
    cep?: string,
  ): Promise<Endereco[]> {
    const customWhere = endereco
      ? {
          nome: Raw(
            enderecoDb =>
              `LOWER(TRIM(${enderecoDb})) ILIKE LOWER(TRIM('%${endereco}%'))`,
          ),
        }
      : { cep };

    return this.ormRepository.find({
      where: {
        id_municipio,
        ...customWhere,
      },
    });
  }
}

export default EnderecosRepository;
