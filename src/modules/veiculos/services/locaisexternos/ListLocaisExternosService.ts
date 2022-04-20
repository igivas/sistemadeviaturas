import { injectable, inject } from 'tsyringe';

import ILocaisExternosRepository from '@modules/veiculos/repositories/interfaces/ILocaisExternosRepository';
import LocalExterno from '@modules/veiculos/entities/LocalExterno';

@injectable()
class ListLocaisExternosService {
  constructor(
    @inject('LocaisExternosRepository')
    private locaisExternosRepository: ILocaisExternosRepository,
  ) {}

  public async execute(): Promise<LocalExterno[]> {
    const LocaisExternos = await this.locaisExternosRepository.findAllLocaisExternos();

    return LocaisExternos;
  }
}

export default ListLocaisExternosService;
