import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CoreAquisicao from '../core/CoreAquisicao';

class AquisicoesController {
  public async showByIdVeiculo(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { id } = request.params;
    const coreAquisicao = container.resolve(CoreAquisicao);
    const aquisicoes = await coreAquisicao.list(Number.parseInt(id, 10));

    return response.status(200).json(aquisicoes);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { id_usuario } = request.user;
    const { id } = request.params;
    const coreAquisicao = container.resolve(CoreAquisicao);
    const { ...restAquisicao } = request.body;

    const aquisicao = await coreAquisicao.create(
      { ...restAquisicao, id_veiculo: String(id), criado_por: id_usuario },
      undefined,
      request.file,
    );

    return response.status(201).json(aquisicao);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id_usuario } = request.user;
    const coreAquisicao = container.resolve(CoreAquisicao);
    const { ...restAquisicao } = request.body;
    const { id } = request.params;

    const aquisicao = await coreAquisicao.update(
      Number.parseInt(id.toString(), 10),
      { ...restAquisicao, atualizado_por: id_usuario },
      request.file,
    );

    return response.status(200).json(aquisicao);
  }
}

export default AquisicoesController;
