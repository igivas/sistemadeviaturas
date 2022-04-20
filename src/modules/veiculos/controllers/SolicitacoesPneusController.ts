import { Request, Response } from 'express';
import { Repository, getRepository } from 'typeorm';
import SolicitacaoPneu from '../entities/SolicitacaoPneu';
import Veiculo from '../entities/Veiculo';
import AppError from '../../../errors/AppError';

export default class SolicitacoesPneusController {
  private solicitacoesRepository: Repository<SolicitacaoPneu>;

  private veiculoRepository: Repository<Veiculo>;

  public async index(request: Request, response: Response): Promise<Response> {
    this.solicitacoesRepository = getRepository(SolicitacaoPneu);
    let resultado;
    try {
      resultado = await this.solicitacoesRepository.find();
      return response.status(201).json(resultado);
    } catch (error) {
      throw new AppError(error);
    }
  }

  public async show(request: Request, response: Response): Promise<Response> {
    this.solicitacoesRepository = getRepository(SolicitacaoPneu);
    const { id, idSolicitacao } = request.params;
    try {
      const solicitacaoPneu = this.solicitacoesRepository.findOne({
        where: { id_veiculo: id, id_solicitacao_pneu: idSolicitacao },
      });
      return response.status(201).json(solicitacaoPneu);
    } catch (error) {
      throw new AppError(error);
    }
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    this.veiculoRepository = getRepository(Veiculo);
    const resultado = await this.veiculoRepository.findOne({
      where: { id_veiculo: id },
    });
    if (!resultado) {
      throw new AppError('Não pode encontrar veículo');
    }

    this.solicitacoesRepository = getRepository(SolicitacaoPneu);
    const data = request.body;
    const user_id = request.user.id_usuario;
    data.id_veiculo = id;
    data.justificativa_path = 'padrao justificativa path';
    data.solicitacao_path = 'padrao solicitacao path';
    data.laudo_twi_path = 'padrao laudo path';
    const solicitacao = this.solicitacoesRepository.create({
      ...data,
      criador_por: user_id,
    });
    try {
      this.solicitacoesRepository.create(solicitacao);
      await this.solicitacoesRepository.save(solicitacao);
      return response.status(201).json(data);
    } catch (error) {
      throw new AppError(error);
    }
  }

  public async update(request: Request, response: Response): Promise<Response> {
    this.solicitacoesRepository = getRepository(SolicitacaoPneu);
    const { id, idSolicitacao } = request.params;
    try {
      const solicitacaoPneu = await this.solicitacoesRepository.findOne({
        where: { id_solicitacao_pneu: idSolicitacao },
      });
      if (!solicitacaoPneu) {
        throw new AppError('Não pode encontrar a solicitacao de Pneu');
      }
      const data = request.body;
      data.id_veiculo = id;
      data.id_solicitacao_pneu = idSolicitacao;
      this.solicitacoesRepository.merge(solicitacaoPneu, data);
      const soliciatcaoAtualizada = await this.solicitacoesRepository.save(
        solicitacaoPneu,
      );
      return response.status(201).json(soliciatcaoAtualizada);
    } catch (error) {
      throw new AppError(error);
    }
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { idSolicitacao } = request.body;
    try {
      const solicitacaoPneu = await this.solicitacoesRepository.findOne({
        where: { id_veiculo: id, id_solicitacao_pneu: idSolicitacao },
      });
      if (!solicitacaoPneu) {
        throw new AppError('Não pode deletar a solicitação especificada');
      }
      await this.solicitacoesRepository.delete(idSolicitacao);
      return response
        .status(201)
        .json({ message: 'Solicitação de Pneu removida com sucesso' });
    } catch (error) {
      throw new AppError(error);
    }
  }
}
