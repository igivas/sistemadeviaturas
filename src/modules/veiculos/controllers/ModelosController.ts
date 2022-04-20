import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CoreVeiculos from '../core/CoreVeiculos';
import CoreVeiculosModelos from '../core/CoreVeiculosModelos';

export default class ModelosController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { id_usuario } = request.user;
    const { ...veiculosModelos } = request.body;

    const coreVeiculosModelos = container.resolve(CoreVeiculosModelos);

    const veiculosModelosCreated = await coreVeiculosModelos.create({
      veiculos_modelos: [{ ...veiculosModelos }],
      criado_por: id_usuario,
    });

    return response.status(201).json(veiculosModelosCreated);
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const { page, perPage, opm } = request.query;

    const coreVeiculos = container.resolve(CoreVeiculos);

    const resultado = await coreVeiculos.showModelos(
      opm ? opm.toString() : '',
      page?.toString(),
      perPage?.toString(),
    );

    return response.status(200).json(resultado);
  }

  public async list(request: Request, response: Response): Promise<Response> {
    const {
      page,
      perPage,
      query,
      id_veiculo_marca,
      id_veiculo_especie,
      opms,
      is_carga,
      fields,
      fieldSort,
      orderSort,
    } = request.query;

    const coreVeiculosModelos = container.resolve(CoreVeiculosModelos);

    const result = await coreVeiculosModelos.showModelos({
      opms: opms ? opms.toString() : '',
      page: Number(page),
      perPage: Number(perPage),
      query: query ? String(query) : '',
      id_veiculo_marca: id_veiculo_marca ? id_veiculo_marca.toString() : '',
      id_veiculo_especie: id_veiculo_especie
        ? id_veiculo_especie.toString()
        : '',
      existCarga: is_carga as '1',
      fields: fields as string[],
      fieldSort: fieldSort as string[],
      orderSort: orderSort as string[],
    });

    return response.json(result);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const user_id = request.user;
    const { body } = request.body;

    const coreVeiculosModelos = container.resolve(CoreVeiculosModelos);

    const modeloUpdate = await coreVeiculosModelos.update({
      id,
      body: body || request.body,
      atualizado_por: user_id.id_usuario,
    });

    return response.status(200).json(modeloUpdate);
  }
}
