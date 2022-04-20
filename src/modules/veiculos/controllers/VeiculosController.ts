import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CoreVeiculos from '../core/CoreVeiculos';
import CheckService from '../services/CheckService';

type ITipoFrota = 'operacional' | 'administrativa';
export default class VeiculosController {
  public async index(request: Request, response: Response): Promise<Response> {
    const {
      page,
      perPage,
      query,
      renavam,
      placa,
      chassi,
      frotas,
      id_modelo,
      ids_situacoes_veiculos,
      id_situacao_tipo,
      origem_aquisicao,
      ano_fabricacao,
      opms,
      fields,
      fieldSort,
      orderSort,
      is_reserva,
    } = request.query;

    const coreVeiculo = container.resolve(CoreVeiculos);
    /* Não está sendo usado
    if (
      frotas &&
      frotas
        .toString()
        .trim()
        .match(/^([A-Za-z,]+[A-Za-z,]*)|(A-Za-z)$/)
    ) {
      return response.status(200);
    }
  */
    const veiculos = await coreVeiculo.list({
      page: Number(page),
      perPage: Number(perPage),
      query: query ? String(query) : '',
      fields: fields as string[],
      renavam: renavam ? String(renavam) : '',
      placa: placa ? String(placa) : '',
      chassi: chassi ? String(chassi) : '',
      id_modelo: id_modelo ? id_modelo.toString() : '',
      // eslint-disable-next-line no-nested-ternary
      ids_situacoes_veiculos: ids_situacoes_veiculos
        ? ids_situacoes_veiculos.toString()
        : '',
      ids_situacoes_veiculos_especificos: id_situacao_tipo?.toString() || '',
      origem_aquisicao: origem_aquisicao ? origem_aquisicao.toString() : '',
      ano_fabricacao: ano_fabricacao ? ano_fabricacao.toString() : '',
      opms: opms ? opms.toString() : '',
      fieldSort: fieldSort as string[],
      orderSort: orderSort as string[],
      is_reserva: is_reserva?.toString() as '0' | '1',
    });

    return response.json(veiculos);
  }

  public async findVeiculosLocalizacoes(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const {
      opms,
      page,
      perPage,
      query,
      fields,
      fieldSort,
      orderSort,
    } = request.query;
    const coreVeiculo = container.resolve(CoreVeiculos);

    const veiculosLocalizacoes = await coreVeiculo.getLocaisExternos({
      opms: opms ? opms.toString() : '',
      page: page ? Number.parseInt(page.toString(), 10) : 1,
      perPage: perPage ? Number.parseInt(perPage.toString(), 10) : 10,
      query: query ? String(query) : '',
      fields: fields as string[],
      fieldSort: fieldSort as string[],
      orderSort: orderSort as string[],
    });

    return response.status(200).json(veiculosLocalizacoes);
  }

  public async findAnosFabricacao(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { opms } = request.query;
    const coreVeiculo = container.resolve(CoreVeiculos);
    const anosFabricacoes = await coreVeiculo.showAnosFabricacao(
      opms ? opms.toString() : '',
    );
    return response.status(200).json(anosFabricacoes);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const coreVeiculo = container.resolve(CoreVeiculos);
    const veiculo = await coreVeiculo.show(id);

    return response.json(veiculo);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { ...values } = request.body;
    const { id_usuario } = request.user;

    const checkService = container.resolve(CheckService);

    await Promise.all([
      checkService.execute({
        identificador: values.identificador,
      }),
      checkService.execute({
        veiculo: {
          placa: values.placa,
          chassi: values.chassi,
          numero_crv: values.numero_crv,
          renavam: values.renavam,
          codigo_seguranca_crv: values.codigo_seguranca_crv,
        },
      }),
    ]);

    const coreVeiculo = container.resolve(CoreVeiculos);

    const veiculo = await coreVeiculo.create({
      criado_por: id_usuario,
      atualizado_por: id_usuario,
      file: request.file,
      ...values,
    });

    return response.status(201).json(veiculo);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const user_id = request.user;
    const { body } = request.body;

    const coreVeiculo = container.resolve(CoreVeiculos);

    const veiculoUpdated = await coreVeiculo.update({
      id,
      body: body || request.body,
      file: request.file,
      atualizado_por: user_id.id_usuario,
    });

    return response.status(200).json(veiculoUpdated);
  }

  // public async count(): Promise<Response> {  }
}
