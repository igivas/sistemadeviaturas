import { Request, Response } from 'express';
import { Repository, getRepository } from 'typeorm';
import { container } from 'tsyringe';
import PessoaFisicaPm from '../entities/PessoaFisicaPm';
import UpdateImagePolicialService from '../services/UpdateImagePolicialService';

export default class ImagesController {
  private pessoaRepository: Repository<PessoaFisicaPm>;

  public async show(request: Request, response: Response): Promise<Response> {
    this.pessoaRepository = getRepository(PessoaFisicaPm);
    const { id } = request.params;

    const image = await this.pessoaRepository
      .createQueryBuilder('pessoa_pm')
      .select("encode(pm_foto, 'base64')", 'pm_foto')
      .where('pessoa_pm.pm_codigo = :id', { id })
      .getRawOne();

    return response.json(image?.pm_foto);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    this.pessoaRepository = getRepository(PessoaFisicaPm);
    const { id } = request.params;
    const { id_usuario } = request.user;
    const file = request.file.buffer;

    const updateImageService = container.resolve(UpdateImagePolicialService);

    await updateImageService.execute({
      pm_codigo: id,
      file,
      id_usuario: String(id_usuario),
    });

    return response.status(204).json();
  }
}
