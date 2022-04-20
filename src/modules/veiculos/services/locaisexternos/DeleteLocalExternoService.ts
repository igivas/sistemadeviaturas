import { inject, injectable } from 'tsyringe';
import ILocaisExternosRepository from '@modules/veiculos/repositories/interfaces/ILocaisExternosRepository';
import AppError from '../../../../errors/AppError';

@injectable()
class DeleteVeiculoService {
  constructor(
    @inject('LocaisExternosRepository')
    private locaisRepository: ILocaisExternosRepository,
  ) {}

  public async execute(id: string): Promise<void> {
    const local = await this.locaisRepository.findById(id);

    if (!local) {
      throw new AppError('Local não existe!');
    }

    await this.locaisRepository.destroy(id);
  }
}

export default DeleteVeiculoService;
