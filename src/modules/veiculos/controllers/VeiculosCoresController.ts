import { Request, Response } from 'express';
import { Repository, getRepository } from 'typeorm';
import AppError from '../../../errors/AppError';

import VeiculoCor from '../entities/VeiculoCor';

export default class VeiculosCoresController {
  private veiculoCorRepository: Repository<VeiculoCor>;

  public async index(request: Request, response: Response): Promise<Response> {
    this.veiculoCorRepository = getRepository(VeiculoCor);
    const veiculoscores = await this.veiculoCorRepository.find({
      order: {
        nome: 'ASC',
      },
    });

    return response.json(veiculoscores);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const veiculoCor = await this.veiculoCorRepository.findOne(
      request.params.id,
    );

    if (!veiculoCor) {
      throw new AppError('veiculoCor não existe');
    }
    return response.json(veiculoCor);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { id_usuario } = request.user;
    this.veiculoCorRepository = getRepository(VeiculoCor);

    const data = request.body;

    const veiculo = await this.veiculoCorRepository.findOne({
      nome: data.nome,
    });

    if (veiculo) {
      throw new AppError('A espécie de veículo já existe.');
    }

    const cor = this.veiculoCorRepository.create({
      ...data,
      criado_por: id_usuario,
    });

    await this.veiculoCorRepository.save(cor);

    return response.status(201).json(cor);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const data = request.body;
    const cor = await this.veiculoCorRepository.findOne(id);

    if (!cor) {
      throw new AppError('cor não existe');
    }

    this.veiculoCorRepository.merge(cor, data);

    const veiculoAtualizado = await this.veiculoCorRepository.save(cor);

    return response.json(veiculoAtualizado);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const veiculo = await this.veiculoCorRepository.findOne(id);

    if (!veiculo) {
      throw new AppError('cor não existe');
    }

    await this.veiculoCorRepository.delete(id);

    return response
      .status(200)
      .send({ message: 'Espécie deletado com sucesso!' });
  }
}
