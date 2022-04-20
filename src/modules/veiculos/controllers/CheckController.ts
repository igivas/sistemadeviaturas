import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CheckService from '../services/CheckService';

export default class CheckController {
  async check(request: Request, response: Response): Promise<Response> {
    const { query } = request.query;

    const checkService = container.resolve(CheckService);

    await checkService.execute(
      query ? JSON.parse(query.toString()) : undefined,
    );
    return response.status(200).json();
  }
}
