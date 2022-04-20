import { injectable, inject, container } from 'tsyringe';
import IMovimentacoesRepository from '@modules/veiculos/repositories/interfaces/IMovimentacoesRepository';
import IMovimentacoesTransferenciasRepository from '@modules/veiculos/repositories/interfaces/IMovimentacoesTransferenciasRepository';
import { QueryRunner } from 'typeorm';
import Movimentacao from '@modules/veiculos/entities/Movimentacao';
import MovimentacaoFase from '@modules/veiculos/entities/MovimentacaoFase';
import UnidadeDTOResponse from '@modules/veiculos/dto/Response/UnidadeDTOResponse';
import VeiculoCargaTransferencia from '@modules/veiculos/entities/VeiculoCargaTransferencia';
import EFase from '@modules/veiculos/enums/EFase';
import ETipoMovimentacao from '@modules/veiculos/enums/ETipoMovimentacao';
import IMovimentacoesFasesRepository from '@modules/veiculos/repositories/interfaces/IMovimentacoesFasesRepository';
import {
  IPostMovimentacao,
  IPostMovimentacaoByFile,
  IDefaultMovimentacao,
} from '@modules/veiculos/interfaces/request/IPostMovimentacao';
import { compareAsc } from 'date-fns';
import { IHandleMovimentacao } from '@modules/veiculos/interfaces/patterns/bridge/IHandleMovimentacao';
import ETipoAssinatura from '@modules/veiculos/enums/ETipoAssinatura';
import IVeiculosRepository from '@modules/veiculos/repositories/interfaces/IVeiculosRepository';
import IPessoasFisicasPmsRepository from '@modules/public/repositories/interfaces/IPessoasFisicasPmsRepository';
import IUsuariosRepository from '@modules/seg/repositories/interfaces/IUsuariosRepository';
import PessoaFisicaPm from '@modules/public/entities/PessoaFisicaPm';
import Usuario from '@modules/seg/entities/Usuario';
import EGraduacao from '@modules/public/enums/EGraduacao';
import MovimentacaoService from '@modules/veiculos/services/MovimentacaoService';
import EPerfil from '@modules/veiculos/enums/EPerfil';
import { tiposMovimentacoesFasesPerfisMapper } from '@modules/veiculos/mappers/tiposMovimentacoesFasesPerfisMapper';
import IUnidadesRepository from '@modules/public/repositories/interfaces/IUnidadesRepository';
import { opmCologId } from '@config/constants';
import unidades_view from '../../../../views/unidades_view';
import AppError from '../../../../errors/AppError';
import CoreDocumento from '../CoreDocumento';
import CoreIdentificador from '../CoreIdentificador';

@injectable()
class CoreTransferencia implements IHandleMovimentacao {
  constructor(
    @inject('VeiculosRepository')
    private veiculosRepository: IVeiculosRepository,

    @inject('MovimentacoesRepository')
    private movimentacoesRepository: IMovimentacoesRepository,

    @inject('MovimentacoesTransferenciaRepository')
    private movimentacoesTransferenciaRepository: IMovimentacoesTransferenciasRepository,

    @inject('UsuariosRepository')
    private usuariosRepository: IUsuariosRepository,

    @inject('PessoasFisicasPmsPublicRepository')
    private pessoaRepository: IPessoasFisicasPmsRepository,

    @inject('MovimentacoesFasesRepository')
    private movimentacoesFaseRepository: IMovimentacoesFasesRepository,

    @inject('UnidadesRepository')
    private unidadesRepository: IUnidadesRepository,
  ) {}

  private opmOrigem: UnidadeDTOResponse;

  private opmDestino: UnidadeDTOResponse;

  private movimentacaoBeforeDataMovimentacao: Movimentacao | undefined;

  private movimentacaoAfterDataMovimentacao: Movimentacao | undefined;

  async showMovimentacao(id_movimentacao: number): Promise<object> {
    const movimentacao = await this.movimentacoesRepository.findById(
      id_movimentacao,
      ['dadoMovimentacaoMudancaVeiculo', 'movimentacoesFase'],
    );

    const {
      dadoMovimentacaoMudancaVeiculo: {
        id_dado_movimentacao_mudanca,
        assinado_por: assinado_origem,
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
          if (
            id_tipo_fase === EFase.Oferta ||
            id_tipo_fase === EFase.Concessão
          ) {
            if (assinado_origem) {
              const usuario =
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
          return {
            criado_em,
            criado_por,
            id_tipo_fase,
            id_movimentacao_fase,
            assinado_por,
          };
        }),
      ),
    };
  }

  public async handleMovimentacaoWithFile(
    {
      criado_por,
      data_movimentacao,
      id_tipo_movimentacao_fase,
      id_opm_destino,
      id_opm_origem,
      id_tipo_movimentacao,
      movimentacao_file,
      id_veiculo,
      observacao,
      identificador,
    }: IPostMovimentacaoByFile & {
      id_veiculo: number;
      data_movimentacao: Date;
      id_tipo_movimentacao_fase: EFase;
      movimentacao_file: Express.Multer.File;
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
    /* const movimentacaoFaseOferta = await this.createOferta(
      {
        criado_por,
        id_tipo_movimentacao_fase: id_tipo_movimentacao_fase as EFase,
        id_veiculo,
        data_movimentacao,
        id_opm_destino,
        id_opm_origem,
        id_tipo_movimentacao: id_tipo_movimentacao as ETipoMovimentacao,
        observacao:
          'Movimentação realizada pelo administrador do sistema devido a movimentacao ser de uma data anterior a atual',

        id_documento_sga: -1,

      },
      queryRunner,
    );
 */
    movimentacaoService.createFile(fullPathFilename, movimentacao_file.buffer);

    await queryRunner.commitTransaction();
    await queryRunner.release();

    return fase;
  }

  async handleMovimentacao(
    {
      criado_por,
      id_tipo_movimentacao_fase,
      id_veiculo,
      data_movimentacao,
      id_movimentacao,
      id_opm_destino,
      id_opm_origem,
      id_tipo_movimentacao,
      observacao,
      cpf,
      assinatura,
      pin,
      tipo_assinatura,
      perfis,
      opms,
    }: Omit<IDefaultMovimentacao, 'movimentacao' | 'manutencao'> &
      IPostMovimentacao & { id_veiculo: number },
    queryRunner: QueryRunner,
  ): Promise<MovimentacaoFase & { url_documento_sga: string }> {
    if (Number.isNaN(id_veiculo)) throw new AppError('Id do veiculo inválido');

    const veiculo = await this.veiculosRepository.findById(
      id_veiculo.toString(),
    );

    if (!veiculo) throw new AppError('Id do veiculo inválido');

    let movimentacaoFaseResponse;

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

    const coreDocumento = container.resolve(CoreDocumento);
    let dadosDocumento;
    let movimentacao;
    let movimentacaoFase;
    let dadoMovimentacaoMudancaVeiculo;
    let url_sga;

    /**
     * Deve tratar se na transferencia a opm do usuario de criacao
     */

    if (criado_por.length > 8)
      throw new AppError('Apenas policiais podem criar movimentacao');

    const pessoaPm = await this.pessoaRepository.findByMatricula(criado_por);

    if (!pessoaPm) throw new AppError('Pm não encontrado');

    const unidadeDoPm = await this.unidadesRepository.findById(
      pessoaPm.uni_codigo,
    );

    if (!unidadeDoPm) throw new AppError('Usuario sem unidade');

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
        tiposMovimentacoesFasesPerfisMapper[id_tipo_movimentacao as number][
          id_tipo_movimentacao_fase as number
        ]?.includes(perfil.id_perfil),
    );

    /**
     * Fim tratar se na fase de oferta da movimentacao o usuario tem perfil para criar transferencia
     */

    const movimentacaoService = container.resolve(MovimentacaoService);
    switch (id_tipo_movimentacao_fase) {
      case EFase.Oferta: {
        if (profilesForCreateTransferencia.length < 1)
          throw new AppError(
            'Usuario não tem permissao para criar oferta de transferencia',
          );

        const { opmDestino, opmOrigem } = await movimentacaoService.checkOferta(
          {
            data_movimentacao: data_movimentacao as Date,
            id_tipo_movimentacao_fase,
            id_opm_destino: id_opm_destino as number,
            id_opm_origem: id_opm_origem as number,
            perfis,
          },
          veiculo,
          this.movimentacaoBeforeDataMovimentacao,
          this.movimentacaoAfterDataMovimentacao,
        );

        [this.opmOrigem, this.opmDestino] = unidades_view.renderMany([
          opmDestino,
          opmOrigem,
        ]);

        // deve criar documento com a unidade que ira mediar a transferencia
        dadosDocumento = await coreDocumento.createDocumento(
          {
            user_id: criado_por,
            movimentacao: {
              id_opm_destino: id_opm_destino as number,
              id_opm_origem: id_opm_origem as number,
              id_tipo_movimentacao: id_tipo_movimentacao as number,
              id_veiculo: id_veiculo.toString(),
              data_movimentacao: data_movimentacao as Date,
              id_opm_mediadora: unidadeDoPm.uni_codigo,
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
            opm_destino_comandante: this.opmDestino.getComandante,
            opm_origem_comandante: this.opmOrigem.getComandante,
            observacao,
            id_tipo_movimentacao: id_tipo_movimentacao as ETipoMovimentacao,
            id_opm_destino,
            id_opm_origem,
            url_documento_sga: dadosDocumento.url,
            id_documento_sga: dadosDocumento.id_documento,
            assinado_destino: '0',
            assinado_origem: '0',
          },
          queryRunner,
        );

        break;
      }
      case EFase['Pendente Assinatura']:
        movimentacao = await this.movimentacoesRepository.findById(
          id_movimentacao as number,
          ['dadoMovimentacaoMudancaVeiculo'],
        );

        url_sga = movimentacao.url_documento_sga;

        if (movimentacao.id_veiculo !== id_veiculo)
          throw new AppError('Movimentação não pertencente ao veiculo');

        if (!movimentacao) throw new AppError('Movimentação não encontrada');

        movimentacaoFase = await this.movimentacoesFaseRepository.findLastMovimentacaoByIdMovimentacao(
          id_movimentacao as number,
        );

        if (!movimentacaoFase)
          throw new AppError(
            'Não pode assinar pois não existe fase para esta movimentacao',
          );

        if (
          profilesForCreateTransferencia.length < 1 &&
          !opms.includes(opmCologId) &&
          !opms.includes(
            movimentacao.dadoMovimentacaoMudancaVeiculo.id_opm_origem,
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
            id_tipo_fase: movimentacaoFase.id_tipo_fase,
            pin: pin as string,
            tipo_assinatura: tipo_assinatura as ETipoAssinatura,
            assinado_origem: '0',
          },
          queryRunner,
        );
        break;

      case EFase.Recebimento: {
        const veiculoCarga = await movimentacaoService.showCarga(2, veiculo);
        let veiculoCargaTransferenciaToUpdate;

        movimentacao = await this.movimentacoesRepository.findById(
          id_movimentacao as number,
          [
            'dadoMovimentacaoMudancaVeiculo',
            'dadoMovimentacaoMudancaVeiculo.movimentacaoTransferencia' as keyof Movimentacao,
          ],
        );

        url_sga = movimentacao.url_documento_sga;

        if (
          profilesForCreateTransferencia.length < 1 ||
          !opms.includes(
            movimentacao.dadoMovimentacaoMudancaVeiculo
              .movimentacaoTransferencia.id_opm_destino,
          )
        )
          throw new AppError(
            'Usuario não pode assinar pela opm de destino ou não possui perfil necessario',
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

        const {
          fase,
          movimentacaoTransferencia,
        } = await movimentacaoService.createFaseRecebimento(
          {
            criado_por,
            id_movimentacao: id_movimentacao as number,
            id_tipo_fase: id_tipo_movimentacao_fase as EFase,
            id_veiculo,
            observacao,
          },
          queryRunner,
        );

        const dataCarga = new Date();
        if (!veiculoCarga) {
          veiculoCargaTransferenciaToUpdate = queryRunner.manager.create(
            VeiculoCargaTransferencia,
            {
              opm_carga: movimentacaoTransferencia.id_opm_destino,
              id_veiculo,
              data_carga: new Date(
                dataCarga.getFullYear(),
                dataCarga.getMonth(),
                dataCarga.getDate(),
              ).toISOString(),
            },
          );
        } else {
          veiculoCargaTransferenciaToUpdate = queryRunner.manager.merge(
            VeiculoCargaTransferencia,
            await queryRunner.manager.findOneOrFail(VeiculoCargaTransferencia, {
              where: {
                id_veiculo,
              },
            }),
            {
              opm_carga: movimentacaoTransferencia.id_opm_destino,
              data_carga: new Date(
                dataCarga.getFullYear(),
                dataCarga.getMonth(),
                dataCarga.getDate(),
              ).toISOString(),
            },
          );
        }

        await queryRunner.manager.save(
          VeiculoCargaTransferencia,
          veiculoCargaTransferenciaToUpdate,
        );

        movimentacaoFaseResponse = fase;
        break;
      }

      case EFase.Recusado: {
        dadoMovimentacaoMudancaVeiculo = await movimentacaoService.findDadosMovimentacao(
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

        break;
      }

      default:
        throw new AppError('A Implementar');
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
}

export default CoreTransferencia;
