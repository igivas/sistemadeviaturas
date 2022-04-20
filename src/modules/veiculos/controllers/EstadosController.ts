import { Request, Response } from 'express';
import { Repository, getRepository } from 'typeorm';
import ufs_view from '../../../views/ufs_view';

import Uf from '../../public/entities/Uf';

export default class IdentificadoresController {
  private estadosRepository: Repository<Uf>;

  public async index(request: Request, response: Response): Promise<Response> {
    this.estadosRepository = getRepository(Uf);
    const estados = await this.estadosRepository.find();

    const formatedEstados = ufs_view.renderMany(estados);

    return response.json(formatedEstados);
  }
}
