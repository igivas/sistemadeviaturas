import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { Repository } from 'typeorm';
import CreateTelefonePolicialService from '../services/CreateTelefonePolicialService';
import DeleteTelefonePolicialService from '../services/DeleteTelefonePolicialService';
import UpdateTelefonePolicialService from '../services/UpdateTelefonePolicialService';
import PessoaTelefone from '../entities/PessoaTelefone';

export default class PoliciaisTelefonesController {
  private pessoaTelefoneRepository: Repository<PessoaTelefone>;

  public async create(request: Request, response: Response): Promise<Response> {
    const { pes_fone, pes_tipo_fone, pes_codigo } = request.body;
    const { id_usuario } = request.user;
    const createTelefoneService = container.resolve(
      CreateTelefonePolicialService,
    );

    const telefone = await createTelefoneService.execute({
      pes_fone,
      pes_tipo_fone,
      pes_codigo,
      id_usuario,
    });

    return response.status(201).json(telefone);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const deleteTelefoneService = container.resolve(
      DeleteTelefonePolicialService,
    );

    await deleteTelefoneService.execute(Number(id));

    return response.status(204).json();
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { id_usuario } = request.user;
    const { body } = request;
    const updateTelefoneService = container.resolve(
      UpdateTelefonePolicialService,
    );

    const telefone = await updateTelefoneService.execute(
      Number(id),
      body,
      id_usuario,
    );

    return response.status(200).json(telefone);
  }
}
