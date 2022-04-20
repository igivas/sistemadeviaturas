import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListPoliciaisService from '../services/ListPoliciaisService';

export default class PoliciaisController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { query } = request.query;
    const listService = container.resolve(ListPoliciaisService);

    const policiais = await listService.execute(String(query));

    return response.json(policiais);
  }
}
