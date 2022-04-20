import { Repository, getRepository } from 'typeorm';
import { Request, Response } from 'express';
import VeiculoMarca from '../entities/VeiculoMarca';
import AppError from '../../../errors/AppError';

export default class VeiculosMarcasController {
  private marcasRepository: Repository<VeiculoMarca>;

  public async index(request: Request, response: Response): Promise<Response> {
    this.marcasRepository = getRepository(VeiculoMarca);

    const marcas = await this.marcasRepository.find({
      order: {
        nome: 'ASC',
      },
    });
    return response.status(200).json(marcas);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    this.marcasRepository = getRepository(VeiculoMarca);
    const marca = await this.marcasRepository.find({
      where: { id_veiculo_marca: id },
    });
    if (!marca) {
      throw new AppError('Marca de veiculo não encontrada');
    }
    return response.status(200).json(marca);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    this.marcasRepository = getRepository(VeiculoMarca);
    const { nome } = request.body;
    const { id_usuario } = request.user;

    const marca = await this.marcasRepository.findOne({
      where: { nome },
    });
    if (marca) {
      throw new AppError('Marca de Veiculo ja existente');
    }

    const marcaCreate = this.marcasRepository.create({
      nome,
      criado_por: id_usuario,
    });
    await this.marcasRepository.save(marcaCreate);

    return response.status(201).json(marcaCreate);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const data = request.body;
    this.marcasRepository = getRepository(VeiculoMarca);
    const marca = await this.marcasRepository.findOne({
      where: { id_veiculo_marca: id },
    });
    if (!marca) {
      throw new AppError('Marca de Veiculo não existe');
    }
    this.marcasRepository.merge(marca, data);
    const marcaAtualizada = await this.marcasRepository.save(marca);
    return response.status(200).json(marcaAtualizada);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    this.marcasRepository = getRepository(VeiculoMarca);
    const marca = await this.marcasRepository.findOne({
      where: { id_veiculo_marca: id },
    });
    if (!marca) {
      throw new AppError('Marca de veiculo não encontrada');
    }
    await this.marcasRepository.delete(id);
    return response
      .status(200)
      .json({ message: 'Marca de veiculo deletada com sucesso' });
  }
}
