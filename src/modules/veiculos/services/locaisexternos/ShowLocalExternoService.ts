import { injectable, inject } from 'tsyringe';

import LocalExterno from '@modules/veiculos/entities/LocalExterno';
import ILocaisExternosRepository from '@modules/veiculos/repositories/interfaces/ILocaisExternosRepository';
import AppError from '../../../../errors/AppError';

@injectable()
class ShowLocalExternoService {
  constructor(
    @inject('LocaisExternosRepository')
    private locaisExternosRepository: ILocaisExternosRepository,
  ) {}

  public async execute(id: string): Promise<LocalExterno | undefined> {
    const local = await this.locaisExternosRepository.findById(id);
    if (!local) {
      throw new AppError('Local não encontrado!');
    }
    return local;
  }
}

export default ShowLocalExternoService;
