import { Request, Response } from 'express';
import { Repository, getRepository } from 'typeorm';
import { container } from 'tsyringe';
import AppError from '../../../errors/AppError';
import Movimentacao from '../entities/Movimentacao';
import CheckService from '../services/CheckService';
import CoreMovimentacao from '../core/CoreMovimentacao';
import ETipoMovimentacao from '../enums/ETipoMovimentacao';
import EFase from '../enums/EFase';
import EPerfil from '../enums/EPerfil';

export default class MovimentacoesController {
  private movimentacaoRepository: Repository<Movimentacao>;

  public async index(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const {
      page,
      perPage,
      opms,
      id_itpo_movimentacao,
      fase,
      pendente_assinatura,
      query,
      fields,
      fieldSort,
      orderSort,
    } = request.query;

    const coreMovimentacao = container.resolve(CoreMovimentacao);

    const veiculoMovimentacoes = await coreMovimentacao.list({
      id: id ? Number.parseInt(id.toString(), 10) : undefined,
      page: page ? Number.parseInt(page.toString(), 10) : 1,
      perPage: perPage ? Number.parseInt(perPage.toString(), 10) : 10,
      opms: opms ? opms.toString() : '',
      tipoMovimentacao: id_itpo_movimentacao
        ? (Number.parseInt(
            id_itpo_movimentacao.toString(),
            10,
          ) as ETipoMovimentacao)
        : undefined,
      fase: fase ? (Number.parseInt(fase.toString(), 10) as EFase) : undefined,
      pendingSignature: pendente_assinatura as '0' | '1',
      query: query ? String(query) : '',
      fields: fields as string[],
      fieldSort: fieldSort as string[],
      orderSort: orderSort as string[],
    });

    return response.json(veiculoMovimentacoes);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const coreMovimentacao = container.resolve(CoreMovimentacao);
    const movimentacao = await coreMovimentacao.showMovimentacao(
      Number.parseInt(String(id), 10),
    );

    return response.json(movimentacao);
  }

  public async carga(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { data_movimentacao } = request.query;
    const showMovimentacaoService = container.resolve(CoreMovimentacao);
    const perfilAdmOrSuperAdm = request.user.perfis.find(
      perfil =>
        perfil.id_perfil === EPerfil.Administrador ||
        perfil.id_perfil === EPerfil['Super Administrador'],
    );

    const perfil = (perfilAdmOrSuperAdm ? perfilAdmOrSuperAdm.id_perfil : 0) as
      | 0
      | 1
      | 2;

    const movimentacao = await showMovimentacaoService.showCarga(
      id,
      perfil,
      data_movimentacao?.toString(),
    );

    return response.json(movimentacao);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { id_usuario } = request.user;
    const {
      id_opm_origem,
      id_tipo_movimentacao_fase,
      data_movimentacao,
      assinatura,
      pin,
      tipo_assinatura,
      cpf,
      id_movimentacao,
      id_opm_destino,
      id_tipo_movimentacao,
      observacao,
      id_oficina,
      km,
      data_retorno,
      oberservacao: motivo,
      identificador,
      opms,
    } = request.body;

    const { perfis } = request.user;

    const checkMovimentacaoService = container.resolve(CheckService);

    if (id_tipo_movimentacao_fase === 1) {
      const movimentacaoExists = await checkMovimentacaoService.execute({
        movimentacao: {
          id_veiculo: Number.parseInt(id, 10),
          data_movimentacao,
        },
      });

      if (movimentacaoExists)
        throw new AppError('Movimentacao já está em processo de oferta');
    }

    const coreMovimentacao = container.resolve(CoreMovimentacao);

    const movimentacaoResponse = await coreMovimentacao.createMovimentacaoFase(
      id,
      {
        id_opm_origem,
        id_tipo_movimentacao_fase,
        data_movimentacao,
        assinatura,
        pin,
        tipo_assinatura,
        criado_por: id_usuario,
        cpf,
        id_movimentacao,
        id_tipo_movimentacao,
        movimentacao: {
          id_opm_destino,
          observacao,
          data_retorno,
          identificador,
          perfis,
        },
        manutencao: {
          id_oficina,
          km,
          motivo,
        },
        opms,
      },
      request.file,
    );
    return response.status(201).json(movimentacaoResponse);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    this.movimentacaoRepository = getRepository(Movimentacao);
    const { id } = request.params;

    const data = request.body;
    const movimentacao = await this.movimentacaoRepository.findOne(id);

    if (!movimentacao) {
      throw new AppError('Movimentacao não existe');
    }

    this.movimentacaoRepository.merge(movimentacao, data);

    const movimentacaoAtualizado = await this.movimentacaoRepository.save(
      movimentacao,
    );

    return response.json(movimentacaoAtualizado);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    this.movimentacaoRepository = getRepository(Movimentacao);
    const { id } = request.params;

    const coreMovimentacao = container.resolve(CoreMovimentacao);

    await coreMovimentacao.delete(Number.parseInt(String(id), 10));

    return response
      .status(200)
      .send({ message: 'Movimentacao deletado com sucesso!' });
  }
}
