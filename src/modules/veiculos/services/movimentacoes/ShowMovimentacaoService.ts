import { injectable, inject } from 'tsyringe';
import IMovimentacoesRepository from '@modules/veiculos/repositories/interfaces/IMovimentacoesRepository';

import IGraduacoesRepository from '@modules/public/repositories/interfaces/IGraduacoesRepository';
import IUnidadesRepository from '@modules/public/repositories/interfaces/IUnidadesRepository';
import IPessoasFisicasPmsRepository from '@modules/public/repositories/interfaces/IPessoasFisicasPmsRepository';

import AppError from '../../../../errors/AppError';
import unidadesView from '../../../../views/unidades_view';
import usuariosView from '../../../../views/usuario_view';

@injectable()
class ShowMovimentacaoService {
  constructor(
    @inject('MovimentacoesRepository')
    private movimentacoesRepository: IMovimentacoesRepository,

    @inject('UnidadesRepository')
    private unidadesRepository: IUnidadesRepository,

    @inject('PessoasFisicasPmsPublicRepository')
    private pessoasFisicasPmRepository: IPessoasFisicasPmsRepository,

    @inject('GraduacoesRepository')
    private graduacoesRepository: IGraduacoesRepository,
  ) {}

  public async execute(idMovimentacao: string): Promise<object> {
    /* const id_movimentacao = Number.parseInt(idMovimentacao, 10);

    if (!Number.isSafeInteger(id_movimentacao))
      throw new AppError('Movimentacao inválida ou nao existente');

    const movimentacoes = await this.movimentacoesRepository.findAllByIdFases(
      id_movimentacao,
    );

    const { movimentacoesFase, ...restMovimentacoes } = movimentacoes;

    const [
      opm_origem,
      opm_destino,
      usuarioOrigem,
      usuarioDestino,
    ] = await Promise.all([
      this.unidadesRepository.findById(movimentacoes.id_opm_origem),
      this.unidadesRepository.findById(movimentacoes.id_opm_destino),
      this.pessoasFisicasPmRepository.findById(
        movimentacoes.autoridade_destino,
      ),
      this.pessoasFisicasPmRepository.findById(
        movimentacoes.autoridade_destino,
      ),
    ]);

    let usuario_origem;
    if (usuarioOrigem) {
      const formatedUsuarioOrigem = usuariosView.render(usuarioOrigem);
      const { cpf, matricula, nome } = formatedUsuarioOrigem;

      const graduacao_origem = await this.graduacoesRepository.findById(
        formatedUsuarioOrigem.id_post_grad,
      );

      usuario_origem = {
        cpf,

        matricula,
        nome,
        graduacao: graduacao_origem
          ? {
              id: graduacao_origem.gra_codigo,
              nome: graduacao_origem.gra_nome,
              sigla: graduacao_origem.gra_sigla,
            }
          : {},
      };
    }

    let opmOrigemFormated;
    if (opm_origem) opmOrigemFormated = unidadesView.render(opm_origem);

    let opmDestinoFormated;
    if (opm_destino) opmDestinoFormated = unidadesView.render(opm_destino);

    let usuario_destino;
    if (usuarioDestino) {
      const formatedUsuarioDestino = usuariosView.render(usuarioDestino);
      const { cpf, matricula, nome } = formatedUsuarioDestino;

      const graduacao_destino = await this.graduacoesRepository.findById(
        formatedUsuarioDestino.id_post_grad,
      );

      usuario_destino = {
        cpf,
        matricula,
        nome,
        graduacao: graduacao_destino
          ? {
              id: graduacao_destino.gra_codigo,
              nome: graduacao_destino.gra_nome,
              sigla: graduacao_destino.gra_sigla,
            }
          : {},
      };
    }

    return {
      ...restMovimentacoes,
      movimentacoesFase: movimentacoesFase.map(movimentacaoFase => {
        const {
          id_tipo_movimentacao_fase,
          nome_fase,
        } = movimentacaoFase.tipoMovimentacaoFase;

        const {
          tipoMovimentacaoFase,
          id_movimentacao,
          ...rest
        } = movimentacaoFase;

        return {
          ...rest,
          id_tipo_movimentacao_fase,
          nome_fase,
        };
      }),
      opm_destino: opmDestinoFormated,
      opm_origem: opmOrigemFormated,
      usuario_origem,
      usuario_destino,
    }; */

    return {};
  }
}

export default ShowMovimentacaoService;
