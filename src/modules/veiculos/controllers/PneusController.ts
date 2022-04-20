import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CorePneus from '../core/CorePneus';
// import AppError from '../../../errors/AppError';
// import ReferenciaPneus from '../entities/ReferenciaPneus';

export default class PneusController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { id_veiculo_especie } = request.query;

    const listReferenciasService = container.resolve(CorePneus);

    const referencias = await listReferenciasService.list(
      id_veiculo_especie?.toString(),
    );

    return response.json(referencias);
  }

  // public async show(request: Request, response: Response): Promise<Response> {
  //   const { id } = request.params;
  //   this.referenciaPneusRepo = getRepository(ReferenciaPneus);
  //   try {
  //     const prefixo = await this.referenciaPneusRepo.findOne({
  //       where: { id_referencia_pneu: id },
  //     });
  //     return response.status(201).json(prefixo);
  //   } catch (erro) {
  //     throw new AppError(erro);
  //   }
  // }

  public async create(request: Request, response: Response): Promise<Response> {
    const { referencias_pneus } = request.body;
    const { id_usuario } = request.user;
    const createReferenciaPneusService = container.resolve(CorePneus);
    const referenciaPneuResponse = await createReferenciaPneusService.create({
      referenciasPneus: referencias_pneus,
      criado_por: id_usuario,
    });
    return response.status(201).json(referenciaPneuResponse);
  }

  /*  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    this.referenciaPneusRepo = getRepository(ReferenciaPneus);
    try {
      const referenciaPneu = await this.referenciaPneusRepo.findOne({
        where: { id_referencia_pneu: id },
      });

      if (!referenciaPneu) {
        throw new AppError('Não pode identificar a referencia de pneu');
      }

      const data = request.body;
      this.referenciaPneusRepo.merge(referenciaPneu, data);
      const referenciaPneuAtualizado = await this.referenciaPneusRepo.save(
        referenciaPneu,
      );
      return response.status(201).json(referenciaPneuAtualizado);
    } catch (erro) {
      throw new AppError(erro);
    }
  } */

  // public async delete(request: Request, response: Response): Promise<Response> {
  //   const { id } = request.params;
  //   this.referenciaPneusRepo = getRepository(ReferenciaPneus);
  //   try {
  //     const referenciaPneu = await this.referenciaPneusRepo.findOne({
  //       where: { id_referencia_pneu: id },
  //     });
  //     if (!referenciaPneu) {
  //       throw new AppError('Não pode identificar a referencia de Pneu');
  //     }

  //     await this.referenciaPneusRepo.delete(id);
  //     return response
  //       .status(201)
  //       .json({ message: 'Referência de pneu removida com sucesso' });
  //   } catch (erro) {
  //     throw new AppError(erro);
  //   }
  // }
}
