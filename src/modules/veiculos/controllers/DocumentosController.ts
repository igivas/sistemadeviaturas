import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CoreDocumento from '../core/CoreDocumento';

export default class DocumentosController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { movimentacao } = request.body;
    const { id_usuario } = request.user;
    const coreDocumento = container.resolve(CoreDocumento);
    response.setHeader('Content-Type', 'application/pdf');
    const documento = await coreDocumento.createDocumento({
      movimentacao,
      user_id: id_usuario,
    });

    return response.status(200).send(documento);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const coreDocumento = container.resolve(CoreDocumento);

    coreDocumento.deleteOficio();
    return response.json(200);
  }

  public async generatePin24h(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { user } = request.body;

    const coreDocumento = container.resolve(CoreDocumento);

    const pinResponse = await coreDocumento.gerarPin24H(user as string);

    return response.status(200).json({ message: pinResponse.message });
  }
}
