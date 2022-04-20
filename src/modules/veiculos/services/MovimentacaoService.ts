import { injectable, inject, container } from 'tsyringe';
import IUnidadesRepository from '@modules/public/repositories/interfaces/IUnidadesRepository';
import { compareAsc, parseISO } from 'date-fns';
import Unidade from '@modules/public/entities/Unidade';
import { QueryRunner } from 'typeorm';
import { movimentacaoFolder } from '@config/upload';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';
import { IPostMovimentacao } from '../interfaces/request/IPostMovimentacao';
import EFase from '../enums/EFase';
import AppError from '../../../errors/AppError';
import IDadosMovimentacoesMudancasVeiculosRepository from '../repositories/interfaces/IDadosMovimentacoesMudancasVeiculosRepository';
import Movimentacao from '../entities/Movimentacao';
import IMovimentacoesTransferenciasRepository from '../repositories/interfaces/IMovimentacoesTransferenciasRepository';
import IMovimentacoesFasesRepository from '../repositories/interfaces/IMovimentacoesFasesRepository';
import MovimentacaoFase from '../entities/MovimentacaoFase';
import IMovimentacoesRepository from '../repositories/interfaces/IMovimentacoesRepository';
import ETipoMovimentacao from '../enums/ETipoMovimentacao';
import { CreateMovimentacaoSchema } from '../utils/createMovimentacaoSchema';
import DadoMovimentacaoMudancaVeiculo from '../entities/DadoMovimentacaoMudancaVeiculo';
import MovimentacaoTransferencia from '../entities/MovimentacaoTransferencia';
import Veiculo from '../entities/Veiculo';
import ETipoAssinatura from '../enums/ETipoAssinatura';
import CoreDocumento from '../core/CoreDocumento';

type CreateOfertaTransferencia = {
  opm_origem_comandante?: string;
  opm_destino_comandante?: string;
  id_veiculo: number;
  criado_por: string;
  id_tipo_movimentacao: ETipoMovimentacao;
  data_movimentacao?: Date;
  url_documento_sga: string;
  id_documento_sga: number;
  assinado_origem: '0' | '1';
  assinado_destino: '0' | '1';
  data_retorno?: Date;
  previsao_retorno?: Date;
} & Pick<
  CreateMovimentacaoSchema,
  | 'id_opm_origem'
  | 'id_opm_destino'
  | 'id_tipo_movimentacao_fase'
  | 'observacao'
>;

type ICreateAssinatura = {
  id_movimentacao: number;
  id_tipo_fase: EFase;
  assinatura: string;
  cpf_assinante: string;
  pin: string;
  tipo_assinatura: ETipoAssinatura;
  criado_por: string;
  id_documento_sga: number;
  assinado_origem: '0' | '1';
};

type ICreateCustomRecebimentoTransferencia = {
  id_opm_origem: number;
  id_opm_destino: number;
  observacao?: string;
  criado_por: string;
  id_tipo_movimentacao_fase: EFase;
  id_movimentacao: number;
};

type CreateRecebimentoTransferencia = {
  id_veiculo: number;
  id_movimentacao: number;
  id_tipo_fase: number;
  id_next_tipo_fase?: number;
  observacao?: string;
  criado_por: string;
  assinado_devolucao?: '0' | '1';
};

@injectable()
class MovimentacaoService {
  constructor(
    @inject('UnidadesRepository')
    private unidadesRepository: IUnidadesRepository,

    @inject('DadosMovimentacoesMudancasVeiculosRepository')
    private dadosMovimentacoesMudancasVeiculosRepository: IDadosMovimentacoesMudancasVeiculosRepository,

    @inject('MovimentacoesTransferenciaRepository')
    private movimentacoesTransferenciaRepository: IMovimentacoesTransferenciasRepository,

    @inject('MovimentacoesFasesRepository')
    private movimentacoesFaseRepository: IMovimentacoesFasesRepository,

    @inject('MovimentacoesRepository')
    private movimentacoesRepository: IMovimentacoesRepository,
  ) {}

  createHashedMovimentacaoFolder(
    movimentacao_file: Express.Multer.File,
  ): {
    path: string;
    filename: string;
  } {
    fs.mkdirSync(movimentacaoFolder, { recursive: true });

    const fileHash = `${crypto.randomBytes(6).toString('hex')}-${Date.now()}`;

    const filename = movimentacao_file
      ? `${fileHash}-${movimentacao_file.originalname}`
      : '';
    return {
      path: path.resolve(movimentacaoFolder, filename),
      filename,
    };
  }

  createFile(pathStorage: string, buffer: Buffer): void {
    fs.writeFile(pathStorage, buffer, { flag: 'w' }, function (error) {
      if (error) {
        console.log(error);

        throw error;
      }
    });
  }

  async checkOferta(
    {
      id_tipo_movimentacao_fase,
      id_opm_origem,
      id_opm_destino,
      data_movimentacao,
    }: IPostMovimentacao & {
      data_movimentacao: Date;
      id_tipo_movimentacao_fase: EFase;
      id_opm_origem: number;
      id_opm_destino: number;
    },
    veiculo: Veiculo,
    movimentacaoBeforeDataMovimentacao?: Movimentacao,
    movimentacaoAfterDataMovimentacao?: Movimentacao,
  ): Promise<{
    opmOrigem: Unidade;
    opmDestino: Unidade;
  }> {
    if (id_tipo_movimentacao_fase !== EFase.Oferta)
      throw new AppError('Fase nao coincide com movimentacao');

    if (!id_opm_origem || !id_opm_destino)
      throw new AppError('Não pode ofertar sem opms');

    const [opmOrigem, opmDestino] = await Promise.all([
      this.unidadesRepository.findById(id_opm_origem),
      this.unidadesRepository.findById(id_opm_destino),
    ]);

    if (!opmOrigem) throw new AppError('Opms não encontradas');
    if (!opmDestino) throw new AppError('Opms não encontradas');

    if (movimentacaoBeforeDataMovimentacao) {
      const dadoMovimentacaoMudancaVeiculo = await this.dadosMovimentacoesMudancasVeiculosRepository.findByIdMovimentacao(
        movimentacaoBeforeDataMovimentacao.id_movimentacao,
      );

      const { opm_destino } = await this.showCarga(2, veiculo);

      const faseRecusado = await this.movimentacoesFaseRepository.findLastMovimentacaoByIdMovimentacao(
        movimentacaoBeforeDataMovimentacao?.id_movimentacao,
      );

      if (
        compareAsc(
          new Date(movimentacaoBeforeDataMovimentacao.data_movimentacao),
          data_movimentacao,
        ) >= 0 &&
        opm_destino.uni_codigo !== id_opm_origem &&
        faseRecusado?.id_tipo_fase !== EFase.Recusado
      )
        throw new AppError('Origem do veiculo está incorreta');

      if (
        compareAsc(
          movimentacaoBeforeDataMovimentacao.data_movimentacao,
          data_movimentacao,
        ) === 0 &&
        opm_destino === dadoMovimentacaoMudancaVeiculo.id_opm_origem
      )
        throw new AppError(
          'Não pode fazer movimentação anterior a um veiculo que acabou de ser criado',
        );
    } else if (movimentacaoAfterDataMovimentacao) {
      const dadoMovimentacaoMudancaVeiculo = await this.dadosMovimentacoesMudancasVeiculosRepository.findByIdMovimentacao(
        movimentacaoAfterDataMovimentacao.id_movimentacao,
      );

      const movimentacaoTransferencia = await this.movimentacoesTransferenciaRepository.findByIdDadoMovimentacaoMudancaVeiculo(
        dadoMovimentacaoMudancaVeiculo.id_dado_movimentacao_mudanca,
      );

      if (movimentacaoTransferencia.id_opm_destino !== id_opm_origem)
        throw new AppError('Origem do veiculo está incorreta');

      if (
        compareAsc(
          movimentacaoAfterDataMovimentacao.data_movimentacao,
          data_movimentacao,
        ) === 1 &&
        movimentacaoTransferencia.id_opm_destino ===
          dadoMovimentacaoMudancaVeiculo.id_opm_origem
      )
        throw new AppError(
          'Não pode fazer movimentação anterior a um veiculo que acabou de ser criado',
        );
    }

    return {
      opmOrigem,
      opmDestino,
    };
  }

  async createOferta(
    {
      id_opm_destino,
      id_opm_origem,
      observacao,
      id_tipo_movimentacao,
      id_veiculo,
      opm_origem_comandante,
      id_tipo_movimentacao_fase,
      criado_por,
      data_movimentacao,
      url_documento_sga,
      id_documento_sga,
      assinado_destino,
      assinado_origem,
      data_retorno,
      previsao_retorno,
    }: CreateOfertaTransferencia,
    queryRunner: QueryRunner,
  ): Promise<MovimentacaoFase> {
    const movimentacaoResponse = await this.movimentacoesRepository.create(
      {
        id_veiculo,
        tipo_movimentacao: id_tipo_movimentacao,
        criado_por,
        data_movimentacao,
        url_documento_sga,
        id_documento_sga,
        data_retorno,
        previsao_retorno,
      } as Movimentacao,
      queryRunner,
    );

    const dadoInserted = await this.dadosMovimentacoesMudancasVeiculosRepository.create(
      {
        id_movimentacao: movimentacaoResponse.id_movimentacao,
        id_opm_origem: id_opm_origem as number,
        autoridade_origem: opm_origem_comandante as string,
        assinado_origem,
      } as DadoMovimentacaoMudancaVeiculo,
      queryRunner,
    );

    await this.movimentacoesTransferenciaRepository.create(
      {
        id_dado_movimentacao_mudanca: dadoInserted.id_dado_movimentacao_mudanca,
        assinado_destino,
        id_opm_destino,
      } as MovimentacaoTransferencia,
      queryRunner,
    );

    return this.movimentacoesFaseRepository.create(
      {
        id_tipo_fase: id_tipo_movimentacao_fase,
        id_movimentacao: movimentacaoResponse.id_movimentacao,
        obs: observacao,
        criado_por,
      } as MovimentacaoFase,
      queryRunner,
    );
  }

  async createAssinatura(
    {
      assinatura,
      cpf_assinante,
      criado_por,
      id_movimentacao,
      id_tipo_fase,
      pin,
      tipo_assinatura,
      id_documento_sga,
      assinado_origem,
    }: ICreateAssinatura,
    queryRunner: QueryRunner,
  ): Promise<void> {
    const coreDocumento = container.resolve(CoreDocumento);

    if (
      id_tipo_fase === EFase.Recebimento &&
      !this.checkAssinadoOrigem(assinado_origem)
    ) {
      throw new AppError('A Opm de origem deve primeiro assinar o documento');
    }

    await coreDocumento.assinarDocumento({
      ids_documento: [id_documento_sga],
      assinatura: assinatura as string,
      cpf_assinante,
      pin: pin as string,
      tipo_assinatura: tipo_assinatura as ETipoAssinatura,
    });

    switch (id_tipo_fase) {
      case EFase.Oferta: {
        await this.updateAssinadoOrigem(
          {
            criado_por,
            id_movimentacao: id_movimentacao as number,
          },
          queryRunner,
        );
        break;
      }

      case EFase.Recebimento:
        break;

      default:
        throw new AppError('A implementar fase em assinatura');
    }
  }

  public async updateAssinadoOrigem(
    {
      criado_por,
      id_movimentacao,
    }: { criado_por: string; id_movimentacao: number },
    queryRunner: QueryRunner,
  ): Promise<DadoMovimentacaoMudancaVeiculo> {
    const dadoMovimentacaoMudancaVeiculo = await this.dadosMovimentacoesMudancasVeiculosRepository.findByIdMovimentacao(
      id_movimentacao as number,
    );

    const updatedDado = await this.dadosMovimentacoesMudancasVeiculosRepository.update(
      dadoMovimentacaoMudancaVeiculo,
      {
        assinado_origem: '1',
        assinado_por: criado_por,
      } as DadoMovimentacaoMudancaVeiculo,
      queryRunner,
    );

    return updatedDado as DadoMovimentacaoMudancaVeiculo;
  }

  public checkAssinadoOrigem(assinado_origem: '0' | '1'): boolean {
    return assinado_origem === '1';
  }

  public async findDadosMovimentacao(
    id_movimentacao: number,
  ): Promise<DadoMovimentacaoMudancaVeiculo> {
    return this.dadosMovimentacoesMudancasVeiculosRepository.findByIdMovimentacao(
      id_movimentacao as number,
    );
  }

  public async findMovimentacaoTransferencia(
    id_dado_movimentacao_mudanca: number,
  ): Promise<MovimentacaoTransferencia> {
    return this.movimentacoesTransferenciaRepository.findByIdDadoMovimentacaoMudancaVeiculo(
      id_dado_movimentacao_mudanca,
    );
  }

  public async createOldFaseRecebimento(
    {
      criado_por,
      id_movimentacao,
      id_opm_origem,
      id_opm_destino,
      id_tipo_movimentacao_fase,
      observacao,
    }: ICreateCustomRecebimentoTransferencia,
    queryRunner: QueryRunner,
  ): Promise<MovimentacaoFase> {
    const dadoInserted = await this.dadosMovimentacoesMudancasVeiculosRepository.create(
      {
        id_movimentacao,
        id_opm_origem: id_opm_origem as number,
        assinado_origem: '1',
      } as DadoMovimentacaoMudancaVeiculo,
      queryRunner,
    );

    await this.movimentacoesTransferenciaRepository.create(
      {
        id_dado_movimentacao_mudanca: dadoInserted.id_dado_movimentacao_mudanca,
        assinado_destino: '1',
        id_opm_destino,
      } as MovimentacaoTransferencia,
      queryRunner,
    );

    return this.movimentacoesFaseRepository.create(
      {
        id_tipo_fase: id_tipo_movimentacao_fase,
        id_movimentacao,
        obs: observacao,
        criado_por,
      } as MovimentacaoFase,
      queryRunner,
    );
  }

  public async createFaseRecebimento(
    {
      criado_por,
      id_movimentacao,
      id_tipo_fase,
      observacao,
      assinado_devolucao,
      id_next_tipo_fase,
    }: CreateRecebimentoTransferencia,
    queryRunner: QueryRunner,
  ): Promise<{
    fase: MovimentacaoFase;
    movimentacaoTransferencia: MovimentacaoTransferencia;
  }> {
    const dadoMovimentacaoMudancaVeiculo = await this.findDadosMovimentacao(
      id_movimentacao,
    );

    const movimentacaoTransferencia = await this.findMovimentacaoTransferencia(
      dadoMovimentacaoMudancaVeiculo.id_dado_movimentacao_mudanca,
    );

    const movimentacaoFaseToInsert = await this.movimentacoesFaseRepository.create(
      {
        id_tipo_fase,
        id_movimentacao,
        obs: observacao,
        criado_por,
        id_next_tipo_fase: id_next_tipo_fase as number,
      } as MovimentacaoFase,
      queryRunner,
    );

    return {
      fase: movimentacaoFaseToInsert,
      movimentacaoTransferencia: (await this.movimentacoesTransferenciaRepository.update(
        movimentacaoTransferencia,
        {
          assinado_destino: '1',
          assinado_por: criado_por,
          assinado_devolucao_destino:
            assinado_devolucao === '1' ? '1' : undefined,
        },
      )) as MovimentacaoTransferencia,
    };
  }

  async showCarga(
    nivel: 0 | 1 | 2,
    veiculo: Veiculo,
    data_movimentacao?: string,
  ): Promise<any | undefined> {
    const movimentacao = data_movimentacao
      ? await this.movimentacoesRepository.findVeiculoCarga(
          veiculo.id_veiculo,
          new Date(data_movimentacao),
        )
      : undefined;

    const dataVeiculoCarga = new Date(veiculo.veiculoCarga.data_carga);
    const dataMovimentacao = data_movimentacao
      ? parseISO(data_movimentacao)
      : undefined;

    const opmCarga = await this.unidadesRepository.findById(
      veiculo.veiculoCarga.opm_carga,
    );

    if (!opmCarga) throw new AppError('Veiculo sem opm para carga');

    if (nivel > 0) {
      if (dataMovimentacao) {
        if (
          compareAsc(
            new Date(
              dataVeiculoCarga.getFullYear(),
              dataVeiculoCarga.getMonth(),
              dataVeiculoCarga.getDay(),
            ),
            dataMovimentacao,
          ) <= 0
        )
          return {
            data_movimentacao: dataVeiculoCarga,
            opm_destino: opmCarga,
          };

        if (movimentacao) {
          const opmDestino = await this.unidadesRepository.findById(
            movimentacao.dadoMovimentacaoMudancaVeiculo
              .movimentacaoTransferencia.id_opm_destino,
          );

          if (!opmDestino)
            throw new AppError(
              'Veiculo sem opm de carga Para a data da movimentacao',
            );

          const opmOrigem = movimentacao
            ? await this.unidadesRepository.findById(
                movimentacao.dadoMovimentacaoMudancaVeiculo.id_opm_origem,
              )
            : undefined;

          return {
            data_movimentacao: movimentacao.data_movimentacao,
            id_movimentacao: movimentacao.id_movimentacao,
            opm_origem: opmOrigem || undefined,
            opm_destino: opmDestino,
          };
        }
        return undefined;
      }
    }

    return {
      data_movimentacao: veiculo.veiculoCarga.data_carga,
      opm_destino: opmCarga,
    };
  }
}

export default MovimentacaoService;
