import { Request, Response } from 'express';
import { container } from 'tsyringe';

import TokenAccessService from '@modules/seg/services/TokenAccessService';

export default class TokenController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { matricula, password, payload, expires_in } = req.body;

    const authenticateUser = container.resolve(TokenAccessService);

    const { token } = await authenticateUser.execute({
      matricula,
      password,
      payload,
      expires_in,
    });

    return res.json({ token });
  }
}
