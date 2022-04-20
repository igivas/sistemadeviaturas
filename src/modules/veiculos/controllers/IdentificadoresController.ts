import { Request, Response } from 'express';
import { Repository, getRepository } from 'typeorm';
import { container } from 'tsyringe';
import AppError from '../../../errors/AppError';
import Identificador from '../entities/Identificador';
import ListIdentificadoresByIdVeiculoService from '../services/identificadores/ListIdentificadoresByIdVeiculoService';
import CheckService from '../services/CheckService';
import CoreIdentificador from '../core/CoreIdentificador';

export default class IdentificadoresController {
  private identificadorRepository: Repository<Identificador>;

  public async index(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { page, perPage } = request.query;
    const listIdentificadoresByIdVeiculoService = container.resolve(
      ListIdentificadoresByIdVeiculoService,
    );

    const identificadores = await listIdentificadoresByIdVeiculoService.execute(
      {
        page: page ? page.toString() : '',
        perPage: perPage ? perPage.toString() : '',
      },
      id,
    );

    return response.json(identificadores);
  }

  /* identificadorRepository foi criado manualmente */

  public async show(request: Request, response: Response): Promise<Response> {
    this.identificadorRepository = getRepository(Identificador);
    const identificador = await this.identificadorRepository.findOne(
      request.params.id,
    );

    if (!identificador) {
      throw new AppError('Identificador não existe');
    }
    return response.json(identificador);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { id_usuario } = request.user;
    const data = request.body;

    const checkService = container.resolve(CheckService);
    await checkService.execute({
      identificador: {
        nome: data.identificador,
        data_identificador: data.data_identificador,
      },
    });

    const coreIdentificador = container.resolve(CoreIdentificador);
    const identificador = await coreIdentificador.setIdentificador(
      data,
      id_usuario,
      undefined,
      id,
    );

    return response.status(201).json(identificador);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    this.identificadorRepository = getRepository(Identificador);
    const { id } = request.params;
    const data = request.body;
    const identificador = await this.identificadorRepository.findOne(id);

    if (!identificador) {
      throw new AppError('Identificador não existe');
    }

    this.identificadorRepository.merge(identificador, data);

    const identificadorAtualizado = await this.identificadorRepository.save(
      identificador,
    );

    return response.json(identificadorAtualizado);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    this.identificadorRepository = getRepository(Identificador);
    const { id } = request.params;

    const identificador = await this.identificadorRepository.findOne(id);

    if (!identificador) {
      throw new AppError('Identificador não existe');
    }

    await this.identificadorRepository.delete(id);

    return response
      .status(200)
      .send({ message: 'Identificador deletado com sucesso!' });
  }
}
