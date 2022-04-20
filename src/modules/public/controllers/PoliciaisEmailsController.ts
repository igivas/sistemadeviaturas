import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { Repository, getRepository } from 'typeorm';
import CreateEmailPolicialService from '../services/CreateEmailPolicialService';
import PessoaEmail from '../entities/PessoaEmail';
import AppError from '../../../errors/AppError';

export default class PoliciaisEmailsController {
  private pessoaEmailRepository: Repository<PessoaEmail>;

  public async create(request: Request, response: Response): Promise<Response> {
    const { pes_email, pes_codigo } = request.body;
    const { id_usuario } = request.user;
    const createEmailService = container.resolve(CreateEmailPolicialService);

    const email = await createEmailService.execute({
      pes_email,
      pes_codigo,
      id_usuario,
    });

    return response.json(email);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    this.pessoaEmailRepository = getRepository(PessoaEmail);

    const email = await this.pessoaEmailRepository.findOne(id);

    if (!email) {
      throw new AppError('O id do Email informado não existe');
    }

    await this.pessoaEmailRepository.remove(email);

    return response.status(204).json();
  }
}
