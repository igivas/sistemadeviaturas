import { Request, Response } from 'express';
import { container } from 'tsyringe';
import AppError from '../../../errors/AppError';

import CreateLocalExternoService from '../services/locaisexternos/CreateLocalExternoService';
import ListPaginatedLocaisExternosService from '../services/locaisexternos/ListPaginatedLocaisExternosService';
import ListLocaisExternosService from '../services/locaisexternos/ListLocaisExternosService';
import ShowLocalExternoService from '../services/locaisexternos/ShowLocalExternoService';
import UpdateLocalExternoService from '../services/locaisexternos/UpdateLocalExternoService';
import DeleteLocalExternoService from '../services/locaisexternos/DeleteLocalExternoService';

export default class LoaisExternosController {
  public async index(request: Request, response: Response): Promise<Response> {
    throw new AppError('Local index não existe');
  }

  public async show(request: Request, response: Response): Promise<Response> {
    throw new AppError('Local show não existe');
  }

  public async create(request: Request, response: Response): Promise<Response> {
    throw new AppError('Local create não existe');
  }

  public async update(request: Request, response: Response): Promise<Response> {
    throw new AppError('Local update não existe');
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    throw new AppError('Local delete não existe');
  }
}
