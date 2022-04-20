import { injectable, inject } from 'tsyringe';

import ILocaisExternosRepository from '@modules/veiculos/repositories/interfaces/ILocaisExternosRepository';
import LocalExterno from '@modules/veiculos/entities/LocalExterno';

interface IRequest {
  page: number;
  perPage: number;
  query: string;
}

interface IResponse {
  total: number;
  totalPage: number;
  items: LocalExterno[];
}

@injectable()
class ListLocaisExternosService {
  constructor(
    @inject('LocaisExternosRepository')
    private locaisExternosRepository: ILocaisExternosRepository,
  ) {}

  public async execute({ page, perPage, query }: IRequest): Promise<IResponse> {
    const LocaisExternos = await this.locaisExternosRepository.findLocaisExternos(
      Number(page),
      Number(perPage),
      query,
    );

    return LocaisExternos;
  }
}

export default ListLocaisExternosService;
