import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { Repository } from 'typeorm';

import UpdateEnderecoPolicialService from '../services/UpdateEnderecoPolicialService';
import PessoaEndereco from '../entities/PessoaEndereco';
import ShowPolicialEnderecoService from '../services/ShowPolicialEnderecoService';
import CreateEnderecoPolicialService from '../services/CreateEnderecoPolicialService';

export default class PoliciaisEnderecosController {
  private PessoaEnderecoRepository: Repository<PessoaEndereco>;

  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { id_usuario } = request.user;
    const { body } = request;
    const updateEnderecoService = container.resolve(
      UpdateEnderecoPolicialService,
    );

    const endereco = await updateEnderecoService.execute({
      pes_codigo_endereco: Number(id),
      id_usuario,
      ...body,
    });

    return response.status(200).json(endereco);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { id_usuario } = request.user;
    const { body } = request;
    const createEnderecoService = container.resolve(
      CreateEnderecoPolicialService,
    );

    const endereco = await createEnderecoService.execute({
      id_usuario,
      ...body,
    });

    return response.status(200).json(endereco);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const showEnderecoService = container.resolve(ShowPolicialEnderecoService);

    const endereco = await showEnderecoService.execute(Number(id));

    return response.status(200).json(endereco);
  }
}
