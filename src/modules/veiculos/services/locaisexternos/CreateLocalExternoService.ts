import { injectable, inject } from 'tsyringe';

import LocalExterno from '@modules/veiculos/entities/LocalExterno';
import ILocaisExternosRepository from '@modules/veiculos/repositories/interfaces/ILocaisExternosRepository';
import { getManager } from 'typeorm';

// interface IRequest {
//   page: number;
//   perPage: number;
//   query: string;
// }

@injectable()
class CreateLocalExternoService {
  constructor(
    @inject('LocaisExternosRepository')
    private locaisRepository: ILocaisExternosRepository,
  ) {}

  public async execute(data: object): Promise<LocalExterno> {
    let local = {} as LocalExterno;
    await getManager().transaction(async trx => {
      local = await this.locaisRepository.create(trx, data);
    });
    return local;
  }
}

export default CreateLocalExternoService;
