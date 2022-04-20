import { injectable, inject } from 'tsyringe';

import IOrgaosRepository from '@modules/veiculos/repositories/interfaces/IOrgaosRepository';

import Orgao from '../../entities/Orgao';

@injectable()
class ListOrgaosService {
  constructor(
    @inject('OrgaosRepository')
    private orgaosRepository: IOrgaosRepository,
  ) {}

  public async execute(): Promise<Orgao[]> {
    const orgaos = await this.orgaosRepository.findOrgaos();

    return orgaos;
  }
}

export default ListOrgaosService;
