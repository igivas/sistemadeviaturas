import { Request, Response } from 'express';
import container from '../../../container/index';
import CoreEmail from '../core/CoreEmail';

class EmailsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { page, perPage, query, active } = request.query;

    const coreEmail = container.resolve(CoreEmail);
    const emails = await coreEmail.list({
      page: page ? page.toString() : '',
      perPage: perPage ? perPage.toString() : '',
      email: query?.toString(),
      active: active?.toString() as '0' | '1',
    });

    return response.status(200).json(emails);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { emails } = request.body;
    const { id_usuario } = request.user;
    const coreEmail = container.resolve(CoreEmail);

    const createdEmails = await coreEmail.create({ emails }, id_usuario);

    return response.status(201).json(createdEmails);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { ativo, email } = request.body;
    const { id_usuario } = request.user;

    const coreEmail = container.resolve(CoreEmail);
    const updatedEmail = await coreEmail.update(id, {
      ativo,
      email,
      atualizado_por: id_usuario,
    });

    return response.status(202).json(updatedEmail);
  }
}

export default EmailsController;
