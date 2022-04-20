import { injectable, inject, container } from 'tsyringe';
import IUnidadesRepository from '@modules/public/repositories/interfaces/IUnidadesRepository';
import { orderBy } from 'lodash';
import AppError from '../../../errors/AppError';
import IMovimentacoesRepository from '../repositories/interfaces/IMovimentacoesRepository';
import IVeiculosRepository from '../repositories/interfaces/IVeiculosRepository';
import CoreTransferencia from './movimentacao/CoreTransferência';
import ETipoMovimentacao from '../enums/ETipoMovimentacao';
import { IDefaultMovimentacao } from '../interfaces/request/IPostMovimentacao';
import { movimentacoesFasesMapper } from '../mappers/tiposMovimentacoesFasesMapper';
import AbstractMovimentacao from '../patterns/bridge/AbstractMovimentacao';
import { IGetMovimentacoes } from '../interfaces/request/IGetMovimentacoes';
import { IResponseMovimentacao } from '../interfaces/response/IResponseMovimentacoes';
import EFase from '../enums/EFase';
import { IResponseVeiculoCarga } from '../interfaces/response/IResponseVeiculoCarga';
import unidades_view from '../../../views/unidades_view';
import CoreManutencao from './movimentacao/CoreManutencao';
import MovimentacaoService from '../services/MovimentacaoService';
import CoreEmprestimo from './movimentacao/CoreEmprestimo';
import Movimentacao from '../entities/Movimentacao';

@injectable()
class CoreMovimentacao {
  constructor(
    @inject('MovimentacoesRepository')
    private movimentacoesRepository: IMovimentacoesRepository,

    @inject('VeiculosRepository')
    private veiculosRepository: IVeiculosRepository,

    @inject('UnidadesRepository')
    private unidadesRepository: IUnidadesRepository,
  ) {}

  public async showMovimentacao(id_movimentacao: number): Promise<object> {
    if (Number.isNaN(id_movimentacao))
      throw new AppError('Movimentacao Invalida');

    const movimentacao = await this.movimentacoesRepository.findById(
      id_movimentacao,
    );

    let handleShowMovimentacao;
    switch (movimentacao.tipo_movimentacao as ETipoMovimentacao) {
      case ETipoMovimentacao.TRANSFERENCIA:
        handleShowMovimentacao = container.resolve(CoreTransferencia);
        break;

      case ETipoMovimentacao.EMPRESTIMO:
        handleShowMovimentacao = container.resolve(CoreEmprestimo);

        break;

      case ETipoMovimentacao.MANUTENCAO:
        handleShowMovimentacao = container.resolve(CoreManutencao);
        break;
      default:
        throw new AppError('A implementar show');
    }

    const abstractMovimentacao = new AbstractMovimentacao(
      handleShowMovimentacao,
    );

    return abstractMovimentacao.showMovimentacao(id_movimentacao);
  }

  public async createMovimentacaoFase(
    id: string,
    defaultMovimentacaoData: IDefaultMovimentacao,
    movimentacao_file?: Express.Multer.File,
  ): Promise<object | undefined> {
    const {
      id_tipo_movimentacao_fase,
      id_movimentacao,
      id_opm_origem,
      id_tipo_movimentacao,
      movimentacao: movimentacaoData,
      manutencao: manutencaoData,
      ...restMovimentacao
    } = defaultMovimentacaoData;

    if (movimentacaoData && !id_tipo_movimentacao && !id_movimentacao)
      throw new AppError(
        'Não pode criar movimentacao sem o tipo de movimentacao ou o id da movimentacao',
      );

    // falta tratar a insercao de acordo com perfil de acesso, nao pelo id do comandante da opm

    const id_veiculo = Number.parseInt(id, 10);

    if (Number.isNaN(id_veiculo))
      throw new AppError('Numero do veiculo invalido');

    const veiculo = await this.veiculosRepository.findById(id);

    if (!veiculo) throw new AppError('Veiculo Inválido');

    let movimentacaoResponse;
    let tipoMovimentacao;

    /**
     * Quando se faz uma oferta ou concessão cria-se uma Movimentação com base
     * no tipo de Movimentacao
     * e não pode ter uma movimentacao anterior (id_movimentacao)
     * id_tipo_movimentcao = Transeferencia, emprestimo,...
     */
    if (id_movimentacao && id_tipo_movimentacao)
      throw new AppError(
        'Id movimentação e Tipo de movimentação não devem existir na mesma requisicao',
      );

    if (id_movimentacao) {
      movimentacaoResponse = await this.movimentacoesRepository.findById(
        id_movimentacao,
      );

      tipoMovimentacao = movimentacaoResponse.tipo_movimentacao;
    } else if (id_tipo_movimentacao) {
      if (
        !movimentacoesFasesMapper[id_tipo_movimentacao].includes(
          id_tipo_movimentacao_fase,
        )
      )
        throw new AppError('Tipo de movimentacao e sua fase nao se relacionam');

      tipoMovimentacao = id_tipo_movimentacao;
    }

    if (
      !tipoMovimentacao ||
      !Object.values(ETipoMovimentacao).includes(tipoMovimentacao)
    )
      throw new AppError('Tipo de movimentação Inválida');

    let handleMovimentacao;

    switch (tipoMovimentacao) {
      // caso seja transferencia
      case ETipoMovimentacao.TRANSFERENCIA:
        // veirificando quais sao as fases da transferencia
        handleMovimentacao = container.resolve(CoreTransferencia);
        break;

      case ETipoMovimentacao.MANUTENCAO:
        handleMovimentacao = container.resolve(CoreManutencao);
        break;

      case ETipoMovimentacao.EMPRESTIMO:
        handleMovimentacao = container.resolve(CoreEmprestimo);
        break;

      default:
        throw new AppError('Movimentacao não existente');
    }

    const abstractMovimentacao = new AbstractMovimentacao(handleMovimentacao);

    const createdMovimentacao = await abstractMovimentacao.handleMovimentacao(
      {
        ...restMovimentacao,
        ...movimentacaoData,
        ...manutencaoData,
        id_movimentacao,
        id_tipo_movimentacao: tipoMovimentacao,
        id_opm_origem: id_opm_origem as number,
        id_opm_destino: movimentacaoData?.id_opm_destino as number,
        id_tipo_movimentacao_fase,
        id_veiculo,
      },
      movimentacao_file,
    );

    return createdMovimentacao;
  }

  private getNumbersArray(values: string): number[] {
    if (!values.match(/^(?:-?\d+,)*-?\d+?$/gm))
      throw new AppError('Formato de valor inválido');
    return values.split(',').map(value => {
      const numberOpm = Number.parseInt(value, 10);
      if (Number.isNaN(numberOpm)) throw new AppError('Opm inválido');
      return numberOpm;
    });
  }

  async list({
    opms,
    page,
    perPage,
    tipoMovimentacao,
    fase,
    pendingSignature,
    id,
    fields,
    query,
    fieldSort,
    orderSort,
  }: IGetMovimentacoes): Promise<IResponseMovimentacao> {
    if (Number.isNaN(page)) throw new AppError('page deve ser um numero');
    if (Number.isNaN(perPage)) throw new AppError('perPage deve ser um numero');

    if (orderSort && fieldSort) {
      if (!Array.isArray(orderSort))
        throw new AppError('O tipo de ordenacao deve ser uma lista');

      if (!Array.isArray(fieldSort))
        throw new AppError('Campos de ordenação devem ser uma lista');

      if (orderSort.length !== fieldSort.length)
        throw new AppError(
          'Tipo de ordenação e campos de ordenação não devem possuir tamanhos diferentes',
        );

      const typesOrder = ['desc', 'asc', 'DESC', 'ASC'];

      orderSort.forEach(order => {
        if (!typesOrder.includes(order))
          throw new AppError('Formato invalido de tipo de ordenacao');
      });
    }

    const isNotTipoMovimentacao =
      !tipoMovimentacao && tipoMovimentacao !== undefined;
    const isNotFase = !!fase && fase !== undefined && !(fase in EFase);

    if (isNotTipoMovimentacao)
      throw new AppError('Tipo de Movimentacao invalida');

    if (isNotFase) throw new AppError('Fase de Movimentacao invalida');

    if (
      !!fase &&
      !!tipoMovimentacao &&
      !movimentacoesFasesMapper[tipoMovimentacao as ETipoMovimentacao].includes(
        fase as EFase,
      )
    )
      throw new AppError('Fase não corresponde ao tipo de movimentacao');

    if (
      pendingSignature &&
      pendingSignature !== '0' &&
      pendingSignature !== '1'
    )
      throw new AppError('Formato de Pendencia de Assinatura invalido');

    if (Number.isNaN(id) && id !== undefined) {
      throw new AppError('Id do veiculo invalido');
    }

    let movimentacoes;
    let total;

    if (id) {
      [
        movimentacoes,
        total,
      ] = await this.movimentacoesRepository.findAllByIdVeiculo(
        id,
        page,
        perPage,
      );
    } else {
      const formatedOpms = this.getNumbersArray(opms);
      if (formatedOpms.length > 400)
        throw new AppError('Quantidade de opms excede a lob');
      [
        movimentacoes,
        total,
      ] = await this.movimentacoesRepository.findMovimentacoes(
        page,
        perPage,
        {
          opms: formatedOpms,
          tipoMovimentacao,
          fase,
          pendingSignature,
        },
        fields,
        query,
        fieldSort,
        orderSort,
      );
    }

    const opmsMovimentacoes = await Promise.all(
      movimentacoes.map(async movimentacao => {
        const opmOrigem = await this.unidadesRepository.findById(
          movimentacao.dadoMovimentacaoMudancaVeiculo.id_opm_origem,
        );

        const opmDestino = movimentacao.dadoMovimentacaoMudancaVeiculo
          ?.movimentacaoTransferencia
          ? await this.unidadesRepository.findById(
              movimentacao.dadoMovimentacaoMudancaVeiculo
                .movimentacaoTransferencia?.id_opm_destino,
            )
          : undefined;

        if (opmOrigem) {
          const formatedUnidadeOrigem = unidades_view.render(opmOrigem);

          return {
            opmOrigem: formatedUnidadeOrigem,
            opmDestino: opmDestino
              ? unidades_view.render(opmDestino)
              : undefined,
          };
        }
        // retorno vazio
        return undefined;
      }),
    );

    const orderFieldOpmOrigemDestino = [];
    const orderTypeFieldOpmOrigemDestino = [];

    if (fieldSort && orderSort) {
      const indexOpmOrigem = fieldSort.findIndex(
        field => field === 'opm_origem.sigla',
      );
      if (indexOpmOrigem >= 0) {
        orderFieldOpmOrigemDestino.push(fieldSort[indexOpmOrigem]);
        orderTypeFieldOpmOrigemDestino.push(orderSort[indexOpmOrigem]);
      }

      const indexOpmDestino = fieldSort.findIndex(
        field => field === 'opm_destino.sigla',
      );

      if (indexOpmDestino >= 0) {
        orderFieldOpmOrigemDestino.push(fieldSort[indexOpmDestino]);
        orderTypeFieldOpmOrigemDestino.push(orderSort[indexOpmDestino]);
      }
    }

    const formatedItems = movimentacoes.map((movimentacao, index) => {
      return {
        prev_devolucao: movimentacao.previsao_retorno,
        data_retorno: movimentacao.data_retorno,
        identificador:
          movimentacao.veiculo?.identificadores[0]?.identificador
            ?.identificador,
        url_documento_sga: movimentacao.url_documento_sga,
        url_documento_devolucao_sga: movimentacao?.url_documento_devolucao_sga,
        id_veiculo: movimentacao.veiculo?.id_veiculo || id,
        placa: movimentacao.veiculo?.placa,
        chassi: movimentacao.veiculo?.chassi,
        renavam: movimentacao.veiculo?.renavam,
        id_movimentacao: movimentacao.id_movimentacao,
        id_tipo_movimentacao: movimentacao.tipo_movimentacao,
        data_movimentacao: movimentacao.data_movimentacao,
        justificativa:
          movimentacao.dadoMovimentacaoMudancaVeiculo?.movimentacaoTransferencia
            ?.justificativa,

        opm_origem: opmsMovimentacoes[index]?.opmOrigem,
        assinado_origem:
          movimentacao.dadoMovimentacaoMudancaVeiculo.assinado_origem,
        assinado_origem_por:
          movimentacao.dadoMovimentacaoMudancaVeiculo.assinado_por,
        assinado_devolucao_origem:
          movimentacao.dadoMovimentacaoMudancaVeiculo
            ?.assinado_devolucao_origem,

        opm_destino: opmsMovimentacoes[index]?.opmDestino,
        assinado_destino:
          movimentacao.movimentacoesFase.findIndex(
            faseRecusado => faseRecusado.id_tipo_fase === EFase.Recusado,
          ) > -1
            ? undefined
            : movimentacao.dadoMovimentacaoMudancaVeiculo
                ?.movimentacaoTransferencia?.assinado_destino,
        assinado_destino_por:
          movimentacao.movimentacoesFase.findIndex(
            faseRecusado => faseRecusado.id_tipo_fase === EFase.Recusado,
          ) > -1
            ? undefined
            : movimentacao.dadoMovimentacaoMudancaVeiculo
                ?.movimentacaoTransferencia?.assinado_por,
        assinado_devolucao_destino:
          movimentacao.dadoMovimentacaoMudancaVeiculo?.movimentacaoTransferencia
            ?.assinado_devolucao_destino,

        fases: movimentacao.movimentacoesFase.map(movimentacaoFase => {
          return {
            criado_em: movimentacaoFase.criado_em,
            id_movimentacao_fase: movimentacaoFase.id_tipo_fase,
          };
        }),
        localizacoes: movimentacao.veiculo?.localizacoes[0]?.localizacao,
        oficina: 'teste',
      };
    });

    return {
      items:
        orderFieldOpmOrigemDestino.length > 0
          ? orderBy(
              formatedItems,
              orderFieldOpmOrigemDestino,
              orderTypeFieldOpmOrigemDestino as ('asc' | 'desc')[],
            )
          : formatedItems,
      total,
      totalPage: Math.ceil((total as number) / perPage),
    };
  }

  async showCarga(
    id: string,
    nivel: 0 | 1 | 2,
    data_movimentacao?: string,
  ): Promise<IResponseVeiculoCarga | undefined> {
    const id_veiculo = Number.parseInt(id, 10);

    if (Number.isNaN(id_veiculo)) throw new AppError('Veiculo invalido');

    const veiculo = await this.veiculosRepository.findById(id);

    if (!veiculo) throw new AppError('Veiculo não encontrado');

    const movimentacaoService = container.resolve(MovimentacaoService);

    const dadosCarga = await movimentacaoService.showCarga(
      nivel,
      veiculo,
      data_movimentacao,
    );
    return dadosCarga
      ? {
          data_movimentacao: dadosCarga.data_movimentacao,
          opm_origem: dadosCarga.opm_origem
            ? unidades_view.render(dadosCarga.opm_origem)
            : undefined,
          opm_destino: unidades_view.render(dadosCarga.opm_destino),
          id_movimentacao: dadosCarga?.id_movimentacao,
        }
      : undefined;
  }

  async delete(id: number): Promise<Movimentacao> {
    if (Number.isNaN(id)) throw new AppError('Id de movimentacao inválido');

    const movimentacao = await this.movimentacoesRepository.findById(id, [
      'dadoMovimentacaoMudancaVeiculo',
      'dadoMovimentacaoMudancaVeiculo.movimentacaoTransferencia' as keyof Movimentacao,
    ]);

    const { dadoMovimentacaoMudancaVeiculo } = movimentacao;

    if (
      dadoMovimentacaoMudancaVeiculo.assinado_origem !== '0' ||
      dadoMovimentacaoMudancaVeiculo.movimentacaoTransferencia
        .assinado_destino !== '0'
    )
      throw new AppError(
        'Movimentacao só pode ser deletada quando origem e destino não tiverem assinados',
      );

    try {
      await this.movimentacoesRepository.delete(id);

      // falta inserir codigo aqui de deletar o id do sga
      return movimentacao;
    } catch (error) {
      throw new AppError('Não pode deletar movimentacao.');
    }
  }
}

export default CoreMovimentacao;
