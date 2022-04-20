import { Request, Response } from 'express';
import container from '../../../container';
import ListEnderecosService from '../services/ListEnderecosService';

export default class EnderecosController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { uf, id_municipio, cep, endereco } = request.query;
    const listEnderecosService = container.resolve(ListEnderecosService);

    const result = await listEnderecosService.execute(
      uf?.toString(),
      id_municipio?.toString(),
      endereco?.toString(),
      cep?.toString(),
    );

    return response.json(result);
  }
}
