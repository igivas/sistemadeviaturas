import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AuthenticateUserService from '@modules/seg/services/AuthenticateUserService';

export default class SessionsController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { matricula, senha } = req.body;

    const authenticateUser = container.resolve(AuthenticateUserService);

    const { usuario, token } = await authenticateUser.execute({
      matricula,
      senha,
    });

    return res.json({ user: usuario, token });
  }
}
