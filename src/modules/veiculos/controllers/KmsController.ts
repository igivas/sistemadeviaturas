import { Request, Response } from 'express';
import container from '../../../container';
import CoreKm from '../core/CoreKm';

export default class KmesController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { page, perPage, data_km } = request.query;
    const coreKm = container.resolve(CoreKm);

    let kmes;

    if (data_km) {
      const [kmBeforeDate, kmAfterDate] = await Promise.all([
        coreKm.findVeiculoKmBeforeDate(
          Number.parseInt(id, 10),
          new Date(String(data_km)),
        ),
        coreKm.findVeiculoKmAfterDate(
          Number.parseInt(id, 10),
          new Date(String(data_km)),
        ),
      ]);

      kmes = kmBeforeDate || kmAfterDate;
    } else {
      kmes = await coreKm.list({
        id,
        page: page?.toString(),
        perPage: perPage?.toString(),
      });
    }
    return response.json(kmes);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    return response.status(200);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { id_usuario } = request.user;
    const { data_km, km_atual } = request.body;

    const coreKm = container.resolve(CoreKm);

    const km = await coreKm.create({
      criado_por: id_usuario,
      data_km,
      id_veiculo: id,
      km_atual,
    });

    return response.status(201).json(km);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    return response.status(200);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    return response.status(200);
  }
}
