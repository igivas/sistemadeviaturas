import { inject, injectable } from 'tsyringe';
import AppError from '../../../errors/AppError';
import { IEnderecosRepository } from '../repositories/interfaces/IEnderecosRepository';
import { IMunicipiosRepository } from '../repositories/interfaces/IMunicipiosRepository';

@injectable()
class ListEnderecosService {
  constructor(
    @inject('MunicipiosRepository')
    private municipiosRepository: IMunicipiosRepository,

    @inject('EnderecosRepository')
    private enderecosRepository: IEnderecosRepository,
  ) {}

  async execute(
    uf?: string,
    id_municipio?: string,
    endereco?: string,
    cep?: string,
  ): Promise<any> {
    if (uf) return this.municipiosRepository.findByUf(uf);

    if (id_municipio)
      if (cep && cep.length !== 8)
        throw new AppError('Cep deve ter exatamente 8 caracteres');
      else
        return this.enderecosRepository.findByMunicipio(
          id_municipio,
          endereco,
          cep,
        );

    throw new Error('To implement');
  }
}

export default ListEnderecosService;
