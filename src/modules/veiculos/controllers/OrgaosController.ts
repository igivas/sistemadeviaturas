import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListOrgaosService from '@modules/veiculos/services/orgaos/ListOrgaosService';
// import AppError from '../../../errors/AppError';
// import Orgaos from '../entities/Orgaos';

export default class OrgaosController {
  public async index(request: Request, response: Response): Promise<Response> {
    const listOrgaosService = container.resolve(ListOrgaosService);

    const referencias = await listOrgaosService.execute();

    return response.json(referencias);
  }

  // public async show(request: Request, response: Response): Promise<Response> {
  //   const { id } = request.params;
  //   this.OrgaosRepo = getRepository(ReferenciaPneus);
  //   try {
  //     const prefixo = await this.referenciaPneusRepo.findOne({
  //       where: { id_referencia_pneu: id },
  //     });
  //     return response.status(201).json(prefixo);
  //   } catch (erro) {
  //     throw new AppError(erro);
  //   }
  // }

  // public async create(request: Request, response: Response): Promise<Response> {
  //   this.referenciaPneusRepo = getRepository(ReferenciaPneus);
  //   const referenciaPneu = this.referenciaPneusRepo.create(request.body);
  //   await this.referenciaPneusRepo.save(referenciaPneu).catch(erro => {
  //     throw new AppError(erro);
  //   });

  //   return response.status(201).json(request.body);
  // }

  // public async update(request: Request, response: Response): Promise<Response> {
  //   const { id } = request.params;
  //   this.referenciaPneusRepo = getRepository(ReferenciaPneus);
  //   try {
  //     const referenciaPneu = await this.referenciaPneusRepo.findOne({
  //       where: { id_referencia_pneu: id },
  //     });

  //     if (!referenciaPneu) {
  //       throw new AppError('Não pode identificar a referencia de pneu');
  //     }

  //     const data = request.body;
  //     this.referenciaPneusRepo.merge(referenciaPneu, data);
  //     const referenciaPneuAtualizado = await this.referenciaPneusRepo.save(
  //       referenciaPneu,
  //     );
  //     return response.status(201).json(referenciaPneuAtualizado);
  //   } catch (erro) {
  //     throw new AppError(erro);
  //   }
  // }

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
