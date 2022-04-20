import { Repository, getRepository } from 'typeorm';
import { Request, Response } from 'express';
import VeiculoModelo from '../entities/VeiculoModelo';
import AppError from '../../../errors/AppError';

export default class MarcasModelosController {
  private ormRepository: Repository<VeiculoModelo>;

  public async index(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    this.ormRepository = getRepository(VeiculoModelo);
    const modelos = await this.ormRepository.find({
      where: [{ id_veiculo_marca: id }, { nome: 'Outros' }],
      order: {
        nome: 'ASC',
      },
    });

    return response.status(200).json(modelos);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    this.ormRepository = getRepository(VeiculoModelo);
    const { nome } = request.body;
    const { id_usuario } = request.user;
    const modelo = await this.ormRepository.findOne({
      where: { nome },
    });
    if (modelo) {
      throw new AppError('Modelo de Veiculo ja existente');
    }

    const modeloCreate = await this.ormRepository.create({
      nome,
      criado_por: id_usuario,
    });
    await this.ormRepository.save(modeloCreate);

    return response.status(201).json(modeloCreate);
  }
}
