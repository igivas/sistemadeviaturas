import { Request, Response } from 'express';
import { Repository, getRepository } from 'typeorm';
import AppError from '../../../errors/AppError';

import VeiculoEspecie from '../entities/VeiculoEspecie';

export default class VeiculosEspeciesController {
  private veiculoEspecieRepository: Repository<VeiculoEspecie>;

  public async index(request: Request, response: Response): Promise<Response> {
    this.veiculoEspecieRepository = getRepository(VeiculoEspecie);
    const veiculosespecies = await this.veiculoEspecieRepository.find({
      order: {
        nome: 'ASC',
      },
    });

    return response.json(veiculosespecies);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const veiculoEspecie = await this.veiculoEspecieRepository.findOne(
      request.params.id,
    );

    if (!veiculoEspecie) {
      throw new AppError('veiculoEspecie não existe');
    }
    return response.json(veiculoEspecie);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    this.veiculoEspecieRepository = getRepository(VeiculoEspecie);
    const { id_usuario } = request.user;
    const data = request.body;

    const veiculo = await this.veiculoEspecieRepository.findOne({
      nome: data.nome,
    });

    if (veiculo) {
      throw new AppError('A espécie de veículo já existe.');
    }

    const veiculoCreate = this.veiculoEspecieRepository.create({
      ...data,
      criado_por: id_usuario,
    });

    await this.veiculoEspecieRepository.save(veiculoCreate);

    return response.status(201).json(veiculoCreate);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const data = request.body;
    const especie = await this.veiculoEspecieRepository.findOne(id);

    if (!especie) {
      throw new AppError('especie não existe');
    }

    this.veiculoEspecieRepository.merge(especie, data);

    const veiculoAtualizado = await this.veiculoEspecieRepository.save(especie);

    return response.json(veiculoAtualizado);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const veiculoEspecie = await this.veiculoEspecieRepository.findOne(id);

    if (!veiculoEspecie) {
      throw new AppError('veiculoEspecie não existe');
    }

    await this.veiculoEspecieRepository.delete(id);

    return response
      .status(200)
      .send({ message: 'Espécie deletado com sucesso!' });
  }
}
