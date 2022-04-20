import { Request, Response } from 'express';
import { getRepository, Repository } from 'typeorm';
import { container } from 'tsyringe';
import SituacaoVeiculo from '../entities/SituacaoVeiculo';
import CoreSituacaoVeiculo from '../core/CoreSituacaoVeiculo';

export default class SituacoesVeiculosController {
  private situacoesVeiculos: Repository<SituacaoVeiculo>;

  public async index(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { page, perPage } = request.query;

    const situacoesVeiculoService = container.resolve(CoreSituacaoVeiculo);

    const situacoesVeiculo = await situacoesVeiculoService.list({
      id,
      page: page ? String(page) : '',
      perPage: perPage ? String(perPage) : '',
    });

    return response.json(situacoesVeiculo);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    this.situacoesVeiculos = getRepository(SituacaoVeiculo);
    const data = request.body;
    const { id_usuario } = request.user;
    const { id } = request.params;

    const coreSituacaoVeiculos = container.resolve(CoreSituacaoVeiculo);

    const situacaoCreate = await coreSituacaoVeiculos.create({
      situacao: data,
      idVeiculo: id,
      id_usuario,
    });

    return response.status(201).json(situacaoCreate);
  }
}
