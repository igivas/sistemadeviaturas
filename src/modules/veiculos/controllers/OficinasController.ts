import { Request, Response } from 'express';
import container from '../../../container';
import CoreOficina from '../core/CoreOficina';

export default class OficinasController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { ...oficina } = request.body;
    const { id_usuario } = request.user;

    const coreOficina = container.resolve(CoreOficina);

    const oficinasCreated = await coreOficina.create({
      oficinas: [{ ...oficina, ativo: '1' }],
      criado_por: id_usuario,
    });

    return response.status(201).json(oficinasCreated);
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const {
      page,
      perPage,
      query,
      fields,
      fieldSort,
      orderSort,
    } = request.query;

    const coreOficina = container.resolve(CoreOficina);
    const oficinas = await coreOficina.list({
      page: page ? Number.parseInt(page.toString(), 10) : undefined,
      perPage: perPage ? Number.parseInt(perPage.toString(), 10) : undefined,
      query: query?.toString(),
      fields: (fields as string[]) || undefined,
      fieldSort: (fieldSort as string[]) || undefined,
      orderSort: (orderSort as string[]) || undefined,
    });

    return response.json(oficinas);
  }

  public async indexMatriz(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const coreOficina = container.resolve(CoreOficina);

    const oficinasMatriz = await coreOficina.listOficinaMatriz();

    return response.json(oficinasMatriz);
  }
}
