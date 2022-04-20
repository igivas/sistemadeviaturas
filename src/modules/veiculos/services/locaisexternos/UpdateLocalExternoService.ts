import { inject, injectable } from 'tsyringe';
import LocalExterno from '@modules/veiculos/entities/LocalExterno';
import ILocaisExternosRepository from '@modules/veiculos/repositories/interfaces/ILocaisExternosRepository';
import AppError from '../../../../errors/AppError';

interface IRequest {
  id: string;
  data: object;
}

@injectable()
class UpdateVeiculoService {
  constructor(
    @inject('LocaisExternosRepository')
    private locaisRepository: ILocaisExternosRepository,
  ) {}

  public async execute({
    id,
    data,
  }: IRequest): Promise<LocalExterno | undefined> {
    const localExiste = await this.locaisRepository.findById(id);

    if (!localExiste) {
      throw new AppError('Local não existe!');
    }

    const local = await this.locaisRepository.update(localExiste, data);

    return local;
  }
}

export default UpdateVeiculoService;
