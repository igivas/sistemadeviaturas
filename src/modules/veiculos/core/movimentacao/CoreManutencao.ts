import { inject, injectable, container } from 'tsyringe';
import MovimentacaoManutencao from '@modules/veiculos/entities/MovimentacaoManutencao';
import EFase from '@modules/veiculos/enums/EFase';
import IOficinasRepository from '@modules/veiculos/repositories/interfaces/IOficinasRepository';
import IVeiculosRepository from '@modules/veiculos/repositories/interfaces/IVeiculosRepository';
import { IMovimentacoesManutencoesRepository } from '@modules/veiculos/repositories/interfaces/IMovimentacoesManutencoesRepository';
import { QueryRunner } from 'typeorm';
import IMovimentacoesRepository from '@modules/veiculos/repositories/interfaces/IMovimentacoesRepository';
import IDadosMovimentacoesMudancasVeiculosRepository from '@modules/veiculos/repositories/interfaces/IDadosMovimentacoesMudancasVeiculosRepository';
import Movimentacao from '@modules/veiculos/entities/Movimentacao';
import DadoMovimentacaoMudancaVeiculo from '@modules/veiculos/entities/DadoMovimentacaoMudancaVeiculo';
import { v4 as uuidV4 } from 'uuid';
import ETipoMovimentacao from '@modules/veiculos/enums/ETipoMovimentacao';
import MovimentacaoFase from '@modules/veiculos/entities/MovimentacaoFase';
import IMovimentacoesFasesRepository from '@modules/veiculos/repositories/interfaces/IMovimentacoesFasesRepository';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';
import { IHandleMovimentacao } from '@modules/veiculos/interfaces/patterns/bridge/IHandleMovimentacao';
import {
  IPostMovimentacaoByFile,
  IDefaultMovimentacao,
} from '@modules/veiculos/interfaces/request/IPostMovimentacao';
import { IPostMovimentacaoManutencao } from '@modules/veiculos/interfaces/request/IPostMovimentacaoManutencao';
import IUnidadesRepository from '@modules/public/repositories/interfaces/IUnidadesRepository';
import IUsuariosRepository from '@modules/seg/repositories/interfaces/IUsuariosRepository';
import PessoaFisicaPm from '@modules/public/entities/PessoaFisicaPm';
import IPessoasFisicasPmsRepository from '@modules/public/repositories/interfaces/IPessoasFisicasPmsRepository';
import Usuario from '@modules/seg/entities/Usuario';
import EGraduacao from '@modules/public/enums/EGraduacao';
import { IManutencoesOficinasRepository } from '@modules/veiculos/repositories/interfaces/IManutencoesOficinasRepository';
import ManutencaoOficina from '@modules/veiculos/entities/ManutencaoOficina';
import CoreSituacaoVeiculo from '../CoreSituacaoVeiculo';
import AppError from '../../../../errors/AppError';
import unidades_view from '../../../../views/unidades_view';

@injectable()
class CoreManutencao implements IHandleMovimentacao {
  constructor(
    @inject('VeiculosRepository')
    private veiculosRepository: IVeiculosRepository,

    @inject('OficinasRepository')
    private oficinasRepository: IOficinasRepository,

    @inject('MovimentacoesManutencoesRepository')
    private movimentacoesManutencoesRepository: IMovimentacoesManutencoesRepository,

    @inject('ManutencoesOficinasRepository')
    private manutencoesOficinasRepository: IManutencoesOficinasRepository,

    @inject('MovimentacoesRepository')
    private movimentacoesRepository: IMovimentacoesRepository,

    @inject('MovimentacoesFasesRepository')
    private movimentacoesFaseRepository: IMovimentacoesFasesRepository,

    @inject('DadosMovimentacoesMudancasVeiculosRepository')
    private dadosMovimentacoesMudancasVeiculosRepository: IDadosMovimentacoesMudancasVeiculosRepository,

    @inject('PessoasFisicasPmsPublicRepository')
    private pessoaRepository: IPessoasFisicasPmsRepository,

    @inject('UsuariosRepository')
    private usuariosRepository: IUsuariosRepository,

    @inject('UnidadesRepository')
    private unidadesRepository: IUnidadesRepository,
  ) {}

  async showMovimentacao(id: number): Promise<any> {
    const movimentacao = await this.movimentacoesRepository.findById(id, [
      'dadoMovimentacaoMudancaVeiculo',
      'movimentacoesFase',
    ]);

    const {
      dadoMovimentacaoMudancaVeiculo: {
        id_dado_movimentacao_mudanca,
        assinado_por: assinado_origem,
      },
      movimentacoesFase,
    } = movimentacao;

    const movimentacaoManutencao = await this.movimentacoesManutencoesRepository.findByIdDadoMovimentacaoMudanca(
      id_dado_movimentacao_mudanca,
    );

    if (!movimentacaoManutencao) throw new AppError('Manutenção não existente');

    return {
      fases: await Promise.all(
        movimentacoesFase.map(async movimentacaoFase => {
          const {
            criado_em,
            criado_por,
            id_tipo_fase,
            id_movimentacao_fase,
          } = movimentacaoFase;

          if (id_tipo_fase === EFase.Entrega) {
            let assinado_por;
            if (assinado_origem === '1') {
              const usuario =
                assinado_origem.length < 9
                  ? await this.pessoaRepository.findByMatricula(assinado_origem)
                  : await this.usuariosRepository.findById(assinado_origem);

              assinado_por =
                assinado_origem.length < 9
                  ? `${EGraduacao[(usuario as PessoaFisicaPm).gra_codigo]} PM ${
                      (usuario as PessoaFisicaPm).pessoa.pes_nome
                    }`
                  : `CIVIL ${(usuario as Usuario).usu_nome}`;
            }
            return {
              criado_em,
              criado_por,
              id_tipo_fase,
              id_movimentacao_fase,
              assinado_por,
            };
          }

          return {
            criado_em,
            criado_por,
            id_tipo_fase,
            id_movimentacao_fase,
          };
        }),
      ),
    };
  }

  async handleMovimentacaoWithFile(
    values: IPostMovimentacaoByFile & { id_veiculo: number },
    queryRunner: QueryRunner,
  ): Promise<MovimentacaoFase> {
    throw new Error('Method not implemented.');
  }

  async handleMovimentacao(
    {
      id_veiculo,
      criado_por,
      id_oficina,
      id_tipo_movimentacao_fase,
      motivo,
      id_opm_origem,
      data_movimentacao,
      id_movimentacao,
      km,
    }: IPostMovimentacaoManutencao &
      Omit<IDefaultMovimentacao, 'movimentacao' | 'manutencao'> & {
        id_veiculo: number;
      },
    queryRunner: QueryRunner,
  ): Promise<MovimentacaoFase> {
    if (Number.isNaN(id_veiculo)) throw new AppError('Id do veiculo inválido');

    const veiculo = await this.veiculosRepository.findById(
      id_veiculo.toString(),
    );

    if (!veiculo) throw new AppError('Veículo não existe');

    let movimentacao: Movimentacao;
    let movimentacaoFase = {} as MovimentacaoFase;
    let dadoMovimentacaoMudancaVeiculo: DadoMovimentacaoMudancaVeiculo;
    let manutencao: MovimentacaoManutencao;

    const coreSituacaoVeiculo = container.resolve(CoreSituacaoVeiculo);

    try {
      switch (id_tipo_movimentacao_fase) {
        case EFase.Entrega:
          {
            const oficina = await this.oficinasRepository.findById(
              id_oficina || '',
            );
            if (!oficina) throw new AppError('Oficina não existe');

            const movimentacaoByDate = await this.movimentacoesRepository.findMovimentacaoBeforeOrEqualDataMovimentacao(
              data_movimentacao as Date,
              id_veiculo,
            );

            const opmOrigem = await this.unidadesRepository.findById(
              id_opm_origem as number,
            );

            if (!opmOrigem) throw new AppError('Opm de origem não encontrada');

            const opm = unidades_view.render(opmOrigem);

            if (
              movimentacaoByDate &&
              movimentacaoByDate.tipo_movimentacao ===
                ETipoMovimentacao.MANUTENCAO
            )
              throw new AppError(
                'Veiculo já está em manutenção para esta data',
              );

            movimentacao = await this.movimentacoesRepository.create(
              {
                id_veiculo,
                tipo_movimentacao: ETipoMovimentacao.MANUTENCAO,
                observacao: motivo,
                criado_por,
                data_movimentacao,
              } as Movimentacao,
              queryRunner,
            );

            [
              dadoMovimentacaoMudancaVeiculo,
              movimentacaoFase,
            ] = await Promise.all([
              this.dadosMovimentacoesMudancasVeiculosRepository.create(
                {
                  assinado_origem: '0',
                  id_opm_origem,
                  id_movimentacao: movimentacao.id_movimentacao,
                  autoridade_origem: opm.getComandante,
                } as DadoMovimentacaoMudancaVeiculo,
                queryRunner,
              ),
              this.movimentacoesFaseRepository.create(
                {
                  criado_por,
                  id_tipo_fase: id_tipo_movimentacao_fase,
                  id_movimentacao: movimentacao.id_movimentacao,
                  id_next_tipo_fase: EFase['Pendente Assinatura'],
                } as MovimentacaoFase,
                queryRunner,
              ),
            ]);

            manutencao = await this.movimentacoesManutencoesRepository.create(
              {
                id_manutencao: uuidV4(),
                id_dado_movimentacao_mudanca:
                  dadoMovimentacaoMudancaVeiculo.id_dado_movimentacao_mudanca,
                criado_por,
              } as MovimentacaoManutencao,
              queryRunner,
            );

            await this.manutencoesOficinasRepository.create(
              {
                id_manutencao_localizacao: uuidV4(),
                id_manutencao: manutencao.id,
                id_oficina: oficina.id,
                data_manutencao_oficina: data_movimentacao?.toISOString(),
              } as ManutencaoOficina,
              queryRunner,
            );

            await coreSituacaoVeiculo.create({
              idVeiculo: id_veiculo.toString(),
              id_usuario: criado_por,
              situacao: {
                data_situacao: data_movimentacao as Date,
                id_situacao_tipo: 1,
                id_situacao_tipo_especificacao: -1,
                km: km as number,
                observacao: motivo,
                localizacao: oficina.nome,
              },
            });
          }

          /**
           * 1) Gerar documento de entrega
           * 2) Assinar documento de entrega
           * 3) Oficina assina e faz upload do documento
           * 4) Colocar situacao da viatura como baixada */
          break;

        case EFase['Pendente Assinatura']:
          {
            movimentacao = await this.checkMovimentacao(id_movimentacao);

            const movimentacaoFaseAtual = await this.movimentacoesFaseRepository.findLastMovimentacaoByIdMovimentacao(
              movimentacao.id_movimentacao,
            );

            if (!movimentacaoFaseAtual)
              throw new AppError('Não existe fase para esta movimentacao');

            const {
              dadoMovimentacaoMudancaVeiculo: actualDadoMovimentacao,
            } = movimentacao;

            [movimentacaoFase] = await Promise.all([
              this.movimentacoesFaseRepository.create({
                criado_por,
                id_movimentacao: movimentacao.id_movimentacao,
                id_next_tipo_fase: EFase['Ordem de Servico'],
                id_tipo_fase: EFase.Vistoria,
              } as MovimentacaoFase),
              this.dadosMovimentacoesMudancasVeiculosRepository.update(
                actualDadoMovimentacao,
                {
                  assinado_origem: '1',
                  assinado_por: criado_por,
                },
              ),
            ]);
          }
          break;

        case EFase.Vistoria:
          {
            movimentacao = await this.checkMovimentacao(id_movimentacao);

            const faseEntrega = await this.movimentacoesFaseRepository.findLastMovimentacaoByIdMovimentacao(
              movimentacao.id_movimentacao,
            );

            if (!faseEntrega)
              throw new AppError('Não existe fase para esta movimentacao');

            if (faseEntrega.id_tipo_fase !== EFase.Entrega)
              throw new AppError(
                'Para realizar vistoria é necessario a fase anterior ser de entrega',
              );

            if (
              movimentacao.dadoMovimentacaoMudancaVeiculo.assinado_origem ===
              '0'
            )
              throw new AppError(
                'Para realizar vistoria é necessario usuario assinar',
              );

            movimentacaoFase = await this.movimentacoesFaseRepository.create(
              {
                criado_por,
                id_movimentacao: movimentacao.id_movimentacao,
                id_tipo_fase: id_tipo_movimentacao_fase,
                id_next_tipo_fase: EFase['Ordem de Servico'],
              } as MovimentacaoFase,
              queryRunner,
            );
          }
          break;

        default:
          throw new AppError('Fase não existente');
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      if (error instanceof EntityNotFoundError)
        throw new AppError('Não existe movimentacao com o valor informado');
      throw error;
    }

    return movimentacaoFase;
  }

  async checkMovimentacao(id_movimentacao?: number): Promise<Movimentacao> {
    if (!id_movimentacao) throw new AppError('Movimentacao não existente');

    if (Number.isNaN(id_movimentacao))
      throw new AppError('Id da movimentação invalido');

    return this.movimentacoesRepository.findById(id_movimentacao, [
      'dadoMovimentacaoMudancaVeiculo',
    ]);
  }
}

export default CoreManutencao;
