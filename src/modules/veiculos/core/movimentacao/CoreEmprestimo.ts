import { injectable, inject, container } from 'tsyringe';
import { IHandleMovimentacao } from '@modules/veiculos/interfaces/patterns/bridge/IHandleMovimentacao';
import IVeiculosRepository from '@modules/veiculos/repositories/interfaces/IVeiculosRepository';
import IMovimentacoesRepository from '@modules/veiculos/repositories/interfaces/IMovimentacoesRepository';
import IMovimentacoesFasesRepository from '@modules/veiculos/repositories/interfaces/IMovimentacoesFasesRepository';
import { QueryRunner } from 'typeorm';
import { IPostMovimentacaoEmprestimo } from '@modules/veiculos/interfaces/request/IPostMovimentacaoEmprestimo';
import {
  IPostMovimentacaoByFile,
  IDefaultMovimentacao,
} from '@modules/veiculos/interfaces/request/IPostMovimentacao';
import MovimentacaoFase from '@modules/veiculos/entities/MovimentacaoFase';
import Movimentacao from '@modules/veiculos/entities/Movimentacao';
import EFase from '@modules/veiculos/enums/EFase';
import MovimentacaoService from '@modules/veiculos/services/MovimentacaoService';
import ETipoMovimentacao from '@modules/veiculos/enums/ETipoMovimentacao';
import { compareAsc } from 'date-fns';
import IDadosMovimentacoesMudancasVeiculosRepository from '@modules/veiculos/repositories/interfaces/IDadosMovimentacoesMudancasVeiculosRepository';
import IMovimentacoesTransferenciasRepository from '@modules/veiculos/repositories/interfaces/IMovimentacoesTransferenciasRepository';
import ETipoAssinatura from '@modules/veiculos/enums/ETipoAssinatura';
import IPessoasFisicasPmsRepository from '@modules/public/repositories/interfaces/IPessoasFisicasPmsRepository';
import IUsuariosRepository from '@modules/seg/repositories/interfaces/IUsuariosRepository';
import EGraduacao from '@modules/public/enums/EGraduacao';
import Usuario from '@modules/seg/entities/Usuario';
import PessoaFisicaPm from '@modules/public/entities/PessoaFisicaPm';
import { tiposMovimentacoesFasesPerfisMapper } from '@modules/veiculos/mappers/tiposMovimentacoesFasesPerfisMapper';
import EPerfil from '@modules/veiculos/enums/EPerfil';
import IUnidadesRepository from '@modules/public/repositories/interfaces/IUnidadesRepository';
import unidades_view from '../../../../views/unidades_view';
import AppError from '../../../../errors/AppError';
import CoreIdentificador from '../CoreIdentificador';
import CoreDocumento from '../CoreDocumento';

@injectable()
class CoreEmprestimo implements IHandleMovimentacao {
  constructor(
    @inject('VeiculosRepository')
    private veiculosRepository: IVeiculosRepository,

    @inject('MovimentacoesRepository')
    private movimentacoesRepository: IMovimentacoesRepository,

    @inject('MovimentacoesFasesRepository')
    private movimentacoesFaseRepository: IMovimentacoesFasesRepository,

    @inject('DadosMovimentacoesMudancasVeiculosRepository')
    private dadosMovimentacoesMudancasVeiculosRepository: IDadosMovimentacoesMudancasVeiculosRepository,

    @inject('MovimentacoesTransferenciaRepository')
    private movimentacoesTransferenciaRepository: IMovimentacoesTransferenciasRepository,

    @inject('UsuariosRepository')
    private usuariosRepository: IUsuariosRepository,

    @inject('PessoasFisicasPmsPublicRepository')
    private pessoaRepository: IPessoasFisicasPmsRepository,
    @inject('UnidadesRepository')
    private unidadesRepository: IUnidadesRepository,
  ) {}

  private movimentacaoBeforeDataMovimentacao: Movimentacao | undefined;

  private movimentacaoAfterDataMovimentacao: Movimentacao | undefined;

  async handleMovimentacao(
    {
      criado_por,
      id_movimentacao,
      id_tipo_movimentacao,
      id_tipo_movimentacao_fase,
      data_movimentacao,
      data_retorno,
      id_veiculo,
      id_opm_destino,
      id_opm_origem,
      observacao,
      assinatura,
      cpf,
      tipo_assinatura,
      pin,
      perfis,
      opms,
    }: IPostMovimentacaoEmprestimo &
      Omit<IDefaultMovimentacao, 'movimentacao' | 'manutencao'> & {
        id_veiculo: number;
      },
    queryRunner: QueryRunner,
  ): Promise<MovimentacaoFase & { url_documento_sga: string }> {
    if (Number.isNaN(id_veiculo)) throw new AppError('Id do veiculo inválido');

    const veiculo = await this.veiculosRepository.findById(
      id_veiculo.toString(),
    );

    if (!veiculo) throw new AppError('Id do veiculo inválido');

    let movimentacaoFaseResponse;
    let movimentacao;

    [
      this.movimentacaoBeforeDataMovimentacao,
      this.movimentacaoAfterDataMovimentacao,
    ] = await Promise.all([
      this.movimentacoesRepository.findMovimentacaoBeforeOrEqualDataMovimentacao(
        data_movimentacao as Date,
        id_veiculo,
      ),
      this.movimentacoesRepository.findMovimentacaoAfterDataMovimentacao(
        data_movimentacao as Date,
        id_veiculo,
      ),
    ]);

    const movimentacaoService = container.resolve(MovimentacaoService);
    const coreDocumento = container.resolve(CoreDocumento);
    let dadosDocumento;
    let url_sga;

    if (criado_por.length > 8)
      throw new AppError('Apenas policiais podem criar movimentacao');

    /**
     * Fim tratar se na transferencia a opm do usuario de criacao
     */

    /**
     * Deve tratar se na fase de oferta da movimentacao o usuario tem perfil para criar transferencia
     */

    const profilesForCreateTransferencia = perfis.filter(
      perfil =>
        perfil.id_perfil === EPerfil.Administrador ||
        perfil.id_perfil === EPerfil['Super Administrador'] ||
        tiposMovimentacoesFasesPerfisMapper[id_tipo_movimentacao as number]?.[
          id_tipo_movimentacao_fase as number
        ]?.includes(perfil.id_perfil),
    );

    /**
     * Fim tratar se na fase de oferta da movimentacao o usuario tem perfil para criar transferencia
     */

    switch (id_tipo_movimentacao_fase) {
      case EFase.Oferta:
        {
          const {
            opmDestino: destino,
            opmOrigem: origem,
          } = await movimentacaoService.checkOferta(
            {
              data_movimentacao: data_movimentacao as Date,
              id_opm_destino: id_opm_destino as number,
              id_opm_origem: id_opm_origem as number,
              id_tipo_movimentacao_fase,
              perfis,
            },
            veiculo,
            this.movimentacaoBeforeDataMovimentacao,
            this.movimentacaoAfterDataMovimentacao,
          );

          const veiculoCarga = await movimentacaoService.showCarga(2, veiculo);

          if (
            !opms.includes(veiculoCarga.opm_destino.uni_codigo) &&
            profilesForCreateTransferencia.length < 1
          )
            throw new AppError(
              'Usuario não pertence a opm ou não possui perfil necessario para para criar movimentacao',
            );

          const [opmOrigem, opmDestino] = unidades_view.renderMany([
            origem,
            destino,
          ]);

          dadosDocumento = await coreDocumento.createDocumento(
            {
              user_id: criado_por,
              movimentacao: {
                id_opm_destino: id_opm_destino as number,
                id_opm_origem: id_opm_origem as number,
                id_tipo_movimentacao: id_tipo_movimentacao as number,
                id_veiculo: id_veiculo.toString(),
                data_movimentacao: data_movimentacao as Date,
              },
            },
            queryRunner,
          );

          url_sga = dadosDocumento.url;

          movimentacaoFaseResponse = await movimentacaoService.createOferta(
            {
              criado_por,
              data_movimentacao:
                compareAsc(
                  this?.movimentacaoBeforeDataMovimentacao
                    ?.data_movimentacao as Date,
                  data_movimentacao as Date,
                ) >= 0
                  ? this?.movimentacaoBeforeDataMovimentacao?.data_movimentacao
                  : data_movimentacao,
              id_veiculo,
              id_tipo_movimentacao_fase,
              opm_destino_comandante: opmDestino.getComandante,
              opm_origem_comandante: opmOrigem.getComandante,
              observacao,
              id_tipo_movimentacao: id_tipo_movimentacao as ETipoMovimentacao,
              id_opm_destino,
              id_opm_origem,
              url_documento_sga: dadosDocumento.url,
              id_documento_sga: dadosDocumento.id_documento as number,
              assinado_destino: '0',
              assinado_origem: '0',
              previsao_retorno: data_retorno,
            },
            queryRunner,
          );
        }
        break;

      case EFase['Pendente Assinatura']:
        {
          movimentacao = await this.movimentacoesRepository.findById(
            id_movimentacao as number,
            ['dadoMovimentacaoMudancaVeiculo'],
          );

          url_sga = movimentacao.url_documento_sga;

          if (movimentacao.id_veiculo !== id_veiculo)
            throw new AppError('Movimentação não pertencente ao veiculo');

          if (!movimentacao) throw new AppError('Movimentação não encontrada');

          movimentacaoFaseResponse = await this.movimentacoesFaseRepository.findLastMovimentacaoByIdMovimentacao(
            id_movimentacao as number,
          );

          const movimentacaoTransferencia = await this.movimentacoesTransferenciaRepository.findByIdDadoMovimentacaoMudancaVeiculo(
            movimentacao.dadoMovimentacaoMudancaVeiculo
              .id_dado_movimentacao_mudanca,
          );

          if (!movimentacaoFaseResponse)
            throw new AppError(
              'Não pode assinar pois não existe fase para esta movimentacao',
            );

          // await movimentacaoService.createAssinatura(
          //   {
          //     assinatura: assinatura as string,
          //     cpf_assinante: cpf as string,
          //     criado_por,
          //     id_documento_sga: movimentacao.id_documento_sga,
          //     id_movimentacao: movimentacao.id_movimentacao,
          //     id_tipo_fase: movimentacaoFase.id_tipo_fase,
          //     pin: pin as string,
          //     tipo_assinatura: tipo_assinatura as ETipoAssinatura,
          //   },
          //   queryRunner,
          // );

          /**
           * Remover linha apos implementacao do sga
           */

          if (movimentacaoFaseResponse.id_tipo_fase === EFase.Devolução) {
            if (movimentacaoTransferencia.assinado_devolucao_destino === '1') {
              if (
                profilesForCreateTransferencia.length < 1 &&
                !opms.includes(
                  movimentacao.dadoMovimentacaoMudancaVeiculo.id_opm_origem,
                )
              )
                throw new AppError(
                  'Apenas a Opm de origem, Opm Colog ou a Perfil Administrador podem assinar',
                );

              await Promise.all([
                await this.dadosMovimentacoesMudancasVeiculosRepository.update(
                  movimentacao.dadoMovimentacaoMudancaVeiculo,
                  {
                    assinado_devolucao_origem: '1',
                    assinado_devolucao_origem_por: criado_por,
                  },
                  queryRunner,
                ),
                this.movimentacoesRepository.update(
                  movimentacao,
                  {
                    data_retorno: new Date(),
                  },
                  queryRunner,
                ),
              ]);
            } else {
              if (
                profilesForCreateTransferencia.length < 1 &&
                !opms.includes(movimentacaoTransferencia.id_opm_destino)
              )
                throw new AppError(
                  'Apenas a Opm de Destino, Opm Colog ou a Perfil Administrador podem assinar',
                );

              await this.movimentacoesRepository.update(
                movimentacao,
                {
                  data_retorno: new Date(),
                },
                queryRunner,
              );

              this.movimentacoesTransferenciaRepository.update(
                movimentacaoTransferencia,
                {
                  ...movimentacaoTransferencia,
                  assinado_devolucao_destino: '1',
                  assinado_devolucao_destino_por: criado_por,
                },
                queryRunner,
              );
            }

            await coreDocumento.assinarDocumento({
              ids_documento: [movimentacao.id_documento_devolucao_sga],
              assinatura: assinatura as string,
              cpf_assinante: cpf as string,
              pin: pin as string,
              tipo_assinatura: tipo_assinatura as ETipoAssinatura,
            });
          } else {
            if (
              profilesForCreateTransferencia.length < 1 &&
              !opms.includes(
                movimentacao.dadoMovimentacaoMudancaVeiculo.id_opm_origem,
              )
            )
              throw new AppError('Apenas a Opm de origem pode assinar');

            await movimentacaoService.createAssinatura(
              {
                assinatura: assinatura as string,
                cpf_assinante: cpf as string,
                criado_por,
                id_documento_sga: movimentacao.id_documento_sga,
                id_movimentacao: movimentacao.id_movimentacao,
                id_tipo_fase: EFase.Oferta,
                pin: pin as string,
                tipo_assinatura: tipo_assinatura as ETipoAssinatura,
                assinado_origem:
                  movimentacao.dadoMovimentacaoMudancaVeiculo.assinado_origem,
              },
              queryRunner,
            );

            await movimentacaoService.updateAssinadoOrigem(
              {
                criado_por,
                id_movimentacao: movimentacao.id_movimentacao,
              },
              queryRunner,
            );
          }
        }
        break;

      case EFase.Recebimento:
        {
          movimentacao = await this.movimentacoesRepository.findById(
            id_movimentacao as number,
            [
              'dadoMovimentacaoMudancaVeiculo',
              'dadoMovimentacaoMudancaVeiculo.movimentacaoTransferencia' as keyof Movimentacao,
            ],
          );

          if (
            profilesForCreateTransferencia.length < 1 &&
            !opms.includes(
              movimentacao.dadoMovimentacaoMudancaVeiculo
                .movimentacaoTransferencia.id_opm_destino,
            )
          )
            throw new AppError(
              'Apenas a Opm de origem, Opm Colog ou a Perfil Administrador podem assinar',
            );

          await movimentacaoService.createAssinatura(
            {
              assinatura: assinatura as string,
              cpf_assinante: cpf as string,
              criado_por,
              id_documento_sga: movimentacao.id_documento_sga,
              id_movimentacao: movimentacao.id_movimentacao,
              id_tipo_fase: id_tipo_movimentacao_fase,
              pin: pin as string,
              tipo_assinatura: tipo_assinatura as ETipoAssinatura,
              assinado_origem:
                movimentacao.dadoMovimentacaoMudancaVeiculo.assinado_origem,
            },
            queryRunner,
          );

          const { fase } = await movimentacaoService.createFaseRecebimento(
            {
              criado_por,
              id_movimentacao: id_movimentacao as number,
              id_tipo_fase: id_tipo_movimentacao_fase as EFase,
              id_veiculo,
              observacao,
              assinado_devolucao: '0',
              id_next_tipo_fase: EFase.Devolução,
            },
            queryRunner,
          );

          movimentacaoFaseResponse = fase;
        }
        break;

      case EFase.Recusado:
        {
          const dadoMovimentacaoMudancaVeiculo = await movimentacaoService.findDadosMovimentacao(
            id_movimentacao as number,
          );

          if (
            !movimentacaoService.checkAssinadoOrigem(
              dadoMovimentacaoMudancaVeiculo.assinado_origem,
            )
          )
            throw new AppError(
              'A Opm de origem deve primeiro assinar o documento',
            );

          movimentacaoFaseResponse = await this.movimentacoesFaseRepository.create(
            {
              id_tipo_fase: id_tipo_movimentacao_fase,
              id_movimentacao,
              obs: observacao,
              criado_por,
            } as MovimentacaoFase,
            queryRunner,
          );
        }
        break;

      case EFase.Devolução:
        {
          movimentacao = await this.movimentacoesRepository.findById(
            id_movimentacao as number,
            ['dadoMovimentacaoMudancaVeiculo'],
          );

          const [faseDevolucao, movimentacaoTransferencia] = await Promise.all([
            this.movimentacoesFaseRepository.findLastMovimentacaoByIdMovimentacao(
              movimentacao.id_movimentacao,
            ),
            this.movimentacoesTransferenciaRepository.findByIdDadoMovimentacaoMudancaVeiculo(
              movimentacao.dadoMovimentacaoMudancaVeiculo
                .id_dado_movimentacao_mudanca,
            ),
          ]);

          if (!faseDevolucao)
            throw new AppError('Movimentação não possui fases');

          if (faseDevolucao.id_next_tipo_fase !== EFase.Devolução)
            throw new AppError(
              'Veiculo so pode ser devolvido se a fase anterior for recebimento',
            );

          dadosDocumento = await coreDocumento.createDocumento(
            {
              user_id: criado_por,
              movimentacao: {
                id_opm_destino: (movimentacao.dadoMovimentacaoMudancaVeiculo
                  .id_opm_origem as number) as number,
                id_opm_origem: movimentacaoTransferencia.id_opm_destino,
                id_tipo_movimentacao: id_tipo_movimentacao as number,
                id_veiculo: id_veiculo.toString(),
                data_movimentacao: data_movimentacao as Date,
              },
            },
            queryRunner,
          );

          url_sga = dadosDocumento.url;

          await Promise.all([
            this.dadosMovimentacoesMudancasVeiculosRepository.update(
              movimentacao.dadoMovimentacaoMudancaVeiculo,
              {
                ...movimentacao.dadoMovimentacaoMudancaVeiculo,
                assinado_devolucao_origem: '0',
              },
              queryRunner,
            ),
            this.movimentacoesTransferenciaRepository.update(
              movimentacaoTransferencia,
              {
                ...movimentacaoTransferencia,
                assinado_devolucao_destino: '0',
              },
              queryRunner,
            ),
            this.movimentacoesRepository.update(
              movimentacao,
              {
                ...movimentacao,
                url_documento_devolucao_sga: dadosDocumento.url,
                id_documento_devolucao_sga: dadosDocumento.id_documento,
              },
              queryRunner,
            ),
          ]);

          movimentacaoFaseResponse = await this.movimentacoesFaseRepository.create(
            {
              id_tipo_fase: id_tipo_movimentacao_fase,
              id_movimentacao: movimentacao.id_movimentacao,
              obs: observacao,
              criado_por,
            } as MovimentacaoFase,
            queryRunner,
          );
        }
        break;

      default:
        throw new AppError('Fase não existente');
    }

    await queryRunner.commitTransaction();
    await queryRunner.release();

    return {
      ...movimentacaoFaseResponse,
      url_documento_sga: url_sga,
    } as MovimentacaoFase & {
      url_documento_sga: string;
    };
  }

  async showMovimentacao(id_movimentacao: number): Promise<object> {
    const movimentacao = await this.movimentacoesRepository.findById(
      id_movimentacao,
      ['dadoMovimentacaoMudancaVeiculo', 'movimentacoesFase'],
    );

    const {
      dadoMovimentacaoMudancaVeiculo: {
        id_dado_movimentacao_mudanca,
        assinado_por: assinado_origem,
        assinado_devolucao_origem_por,
      },
      movimentacoesFase,
    } = movimentacao;

    const movimentacaoTransferencia = await this.movimentacoesTransferenciaRepository.findByIdDadoMovimentacaoMudancaVeiculo(
      id_dado_movimentacao_mudanca,
    );

    return {
      fases: await Promise.all(
        movimentacoesFase.map(async movimentacaoFase => {
          const {
            criado_em,
            criado_por,
            id_tipo_fase,
            id_movimentacao_fase,
          } = movimentacaoFase;

          let assinado_por;
          let assinado_devolucao_destino_por;

          if (id_tipo_fase === EFase.Oferta) {
            let usuario;
            if (assinado_origem) {
              usuario =
                assinado_origem.length < 9
                  ? await this.pessoaRepository.findByMatricula(assinado_origem)
                  : await this.usuariosRepository.findById(assinado_origem);

              if (!usuario)
                throw new AppError(
                  'Não pode encontrar o usuario da movimentacao',
                );

              assinado_por =
                assinado_origem.length < 9
                  ? `${EGraduacao[(usuario as PessoaFisicaPm).gra_codigo]} PM ${
                      (usuario as PessoaFisicaPm).pessoa.pes_nome
                    }`
                  : `CIVIL ${(usuario as Usuario).usu_nome}`;
            }
          } else if (id_tipo_fase === EFase.Recebimento || EFase.Recusado) {
            if (movimentacaoTransferencia.assinado_por) {
              const usuario =
                movimentacaoTransferencia.assinado_por.length < 9
                  ? await this.pessoaRepository.findByMatricula(
                      movimentacaoTransferencia.assinado_por,
                    )
                  : await this.usuariosRepository.findById(
                      movimentacaoTransferencia.assinado_por,
                    );

              assinado_por =
                assinado_origem.length < 9
                  ? `${EGraduacao[(usuario as PessoaFisicaPm).gra_codigo]} PM ${
                      (usuario as PessoaFisicaPm).pessoa.pes_nome
                    }`
                  : `CIVIL ${(usuario as Usuario).usu_nome}`;
            }
          }
          if (id_tipo_fase === EFase.Devolução) {
            let usuario;
            if (assinado_devolucao_origem_por) {
              usuario =
                assinado_origem.length < 9
                  ? await this.pessoaRepository.findByMatricula(assinado_origem)
                  : await this.usuariosRepository.findById(assinado_origem);

              if (!usuario)
                throw new AppError(
                  'Não pode encontrar o usuario da movimentacao',
                );

              assinado_por =
                assinado_origem.length < 9
                  ? `${EGraduacao[(usuario as PessoaFisicaPm).gra_codigo]} PM ${
                      (usuario as PessoaFisicaPm).pessoa.pes_nome
                    }`
                  : `CIVIL ${(usuario as Usuario).usu_nome}`;
            }

            if (movimentacaoTransferencia.assinado_devolucao_destino_por) {
              usuario =
                assinado_origem.length < 9
                  ? await this.pessoaRepository.findByMatricula(
                      movimentacaoTransferencia.assinado_devolucao_destino_por,
                    )
                  : await this.usuariosRepository.findById(
                      movimentacaoTransferencia.assinado_devolucao_destino_por,
                    );

              if (!usuario)
                throw new AppError(
                  'Não pode encontrar o usuario da movimentacao',
                );

              assinado_devolucao_destino_por =
                movimentacaoTransferencia.assinado_devolucao_destino_por
                  .length < 9
                  ? `${EGraduacao[(usuario as PessoaFisicaPm).gra_codigo]} PM ${
                      (usuario as PessoaFisicaPm).pessoa.pes_nome
                    }`
                  : `CIVIL ${(usuario as Usuario).usu_nome}`;
            }
          }

          return {
            criado_em,
            criado_por,
            id_tipo_fase,
            id_movimentacao_fase,
            assinado_por,
            assinado_devolucao_destino_por,
          };
        }),
      ),
    };
  }

  async handleMovimentacaoWithFile(
    {
      criado_por,
      id_opm_destino,
      id_opm_origem,
      id_tipo_movimentacao,
      id_veiculo,
      movimentacao_file,
      identificador,
      observacao,
      data_movimentacao,
      data_retorno,
      id_tipo_movimentacao_fase,
    }: IPostMovimentacaoByFile & {
      id_veiculo: number;
      data_movimentacao: Date;
      id_tipo_movimentacao_fase: EFase;
      movimentacao_file: Express.Multer.File;
      data_retorno: Date;
    },
    queryRunner: QueryRunner,
  ): Promise<MovimentacaoFase> {
    const coreIdentificador = container.resolve(CoreIdentificador);
    const movimentacaoService = container.resolve(MovimentacaoService);

    const {
      filename,
      path: fullPathFilename,
    } = movimentacaoService.createHashedMovimentacaoFolder(movimentacao_file);

    if (identificador)
      await coreIdentificador.setIdentificador(
        {
          data_identificador: data_movimentacao,
          identificador,
          observacao:
            'Identificador Criado atraves de uma movimentcao criada pela Cetic',
        },
        criado_por,
        queryRunner,
        id_veiculo.toString(),
      );

    const movimentacaoResponse = await this.movimentacoesRepository.create(
      {
        id_veiculo,
        tipo_movimentacao: id_tipo_movimentacao,
        criado_por,
        data_movimentacao,
        url_documento_sga: `${
          process.env.NODE_ENV === 'local'
            ? 'http://localhost:4003'
            : 'https://api-sav-dev.pm.ce.gov.br'
        }/documentos/movimentacao/${filename}`,
        data_retorno,
      } as Movimentacao,
      queryRunner,
    );

    const fase = await movimentacaoService.createOldFaseRecebimento(
      {
        criado_por,
        id_movimentacao: movimentacaoResponse.id_movimentacao,
        id_opm_destino,
        id_opm_origem,
        id_tipo_movimentacao_fase,
        observacao,
      },
      queryRunner,
    );

    movimentacaoService.createFile(fullPathFilename, movimentacao_file.buffer);

    await queryRunner.commitTransaction();
    await queryRunner.release();

    return fase as MovimentacaoFase;
  }
}

export default CoreEmprestimo;
