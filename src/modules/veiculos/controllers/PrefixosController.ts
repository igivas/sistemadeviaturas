import { Request, Response } from 'express';
import { Repository, getRepository } from 'typeorm';
import AppError from '../../../errors/AppError';
import Prefixo from '../entities/Prefixo';
import Veiculo from '../entities/Veiculo';

export default class PrefixosController {
  private prefixoRepository: Repository<Prefixo>;

  private veiculoRepository: Repository<Veiculo>;

  public async index(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    this.prefixoRepository = getRepository(Prefixo);
    const prefixos = await this.prefixoRepository.find({
      where: {
        id_veiculo: id,
      },
      order: {
        criado_em: 'DESC',
      },
    });

    return response.json(prefixos);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    this.prefixoRepository = getRepository(Prefixo);
    const prefixo = await this.prefixoRepository.findOne(request.params.id);

    if (!prefixo) {
      throw new AppError('Prefixo não existe');
    }
    return response.json(prefixo);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    this.prefixoRepository = getRepository(Prefixo);
    this.veiculoRepository = getRepository(Veiculo);
    const { id } = request.params;
    const { id_usuario } = request.user;
    const data = request.body;

    const veiculo = await this.veiculoRepository.findOne(id);

    if (!veiculo) {
      throw new AppError('O veículo não existe.');
    }

    data.id_veiculo = id;

    const prefixo = this.prefixoRepository.create({
      ...data,
      criado_por: id_usuario,
    });

    await this.prefixoRepository.save(prefixo);

    return response.status(201).json(prefixo);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    this.prefixoRepository = getRepository(Prefixo);
    const { id } = request.params;
    const data = request.body;
    const prefixo = await this.prefixoRepository.findOne(id);

    if (!prefixo) {
      throw new AppError('Prefixo não existe');
    }

    this.prefixoRepository.merge(prefixo, data);

    const prefixoAtualizado = await this.prefixoRepository.save(prefixo);

    return response.json(prefixoAtualizado);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    this.prefixoRepository = getRepository(Prefixo);
    const { id } = request.params;

    const prefixo = await this.prefixoRepository.findOne(id);

    if (!prefixo) {
      throw new AppError('Prefixo não existe');
    }

    await this.prefixoRepository.delete(id);

    return response
      .status(200)
      .send({ message: 'Prefixo deletado com sucesso!' });
  }
}
