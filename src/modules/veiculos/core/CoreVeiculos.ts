/* eslint-disable prettier/prettier */
import { container, injectable, inject, singleton } from 'tsyringe';
import IUnidadesRepository from '@modules/public/repositories/interfaces/IUnidadesRepository';
import { QueryFailedError, getConnection } from 'typeorm';
import IVeiculosRepository from '@modules/veiculos/repositories/interfaces/IVeiculosRepository';
import { orderBy } from 'lodash';
import { opmCologId, opmNUGCMOTId } from '@config/constants';
import Veiculo from '../entities/Veiculo';
import Km from '../entities/Km';
import Prefixo from '../entities/Prefixo';
import SituacaoVeiculo from '../entities/SituacaoVeiculo';
/* import Movimentacao from '../entities/Movimentacao';
import DadoMovimentacaoMudancaVeiculo from '../entities/DadoMovimentacaoMudancaVeiculo';
import MovimentacaoTransferencia from '../entities/MovimentacaoTransferencia';
import MovimentacaoFase from '../entities/MovimentacaoFase';
import unidadesView from '../../../views/unidades_view';
import EFase from '../enums/EFase'; */
import VeiculoCargaTransferencia from '../entities/VeiculoCargaTransferencia';
import CoreIdentificador from './CoreIdentificador';
import Aquisicao from '../entities/Aquisicao';
import AppError from '../../../errors/AppError';
import Pneu from '../entities/Pneu';
import VeiculoPneu from '../entities/VeiculoPneu';
import { IPostVeiculos } from '../interfaces/request/IPostVeiculos';
import { EEmprego } from '../enums/EPrefixo';
import IKmsRepository from '../repositories/interfaces/IKmsRepository';
import ISituacoesRepository from '../repositories/interfaces/ISituacoesRepository';
/* import IMovimentacoesRepository from '../repositories/interfaces/IMovimentacoesRepository';
import IDadosMovimentacoesMudancasVeiculosRepository from '../repositories/interfaces/IDadosMovimentacoesMudancasVeiculosRepository';
import IMovimentacoesTransferenciasRepository from '../repositories/interfaces/IMovimentacoesTransferenciasRepository';
import IMovimentacoesFasesRepository from '../repositories/interfaces/IMovimentacoesFasesRepository'; */
import { IPutVeiculos } from '../interfaces/request/IPutVeiculos';
import ETipoDocCarga from '../enums/ETipoDocCarga';
import { IIdentificadoresRepository } from '../repositories/interfaces/IIdentificadoresRepository';
import EEspecieVeiculo from '../enums/EEspecieVeiculo';
import { IVeiculosPneusRepository } from '../repositories/interfaces/IVeiculosPneusRepository';
import { IGetFrota } from '../interfaces/request/IGetFrota';
import { EOrigemDeAquisicao } from '../enums/EAquisicao';
import '../../../config/enviroment';
import { IVeiculosLocalizacoesRepository } from '../repositories/interfaces/IVeiculosLocalizacoesRepository';
import { IGetLocaisExternos } from '../interfaces/request/IGetLocaisExternos';
import { IResponseGetVeiculosLocalizacoes } from '../interfaces/response/IResponseGetVeiculosLocalizacoes';
import CoreAquisicao from './CoreAquisicao';

interface IResponse {
  total: number;
  totalPage: number;
  items: object[];
}

type InputData = IPostVeiculos & {
  criado_por: string;
  atualizado_por: string;
  file: Express.Multer.File;
};

interface IRequestUpdate {
  id: string;
  body: IPutVeiculos;
  atualizado_por: string;
}

type IRequestList = {
  page: number;
  perPage: number;
  query: string;
  fields?: string[];
  renavam: string | undefined;
  placa: string | undefined;
  chassi?: string;
  opms: string;
  origem_aquisicao?: string;
  ids_situacoes_veiculos?: string;
  ids_situacoes_veiculos_especificos?: string;
  id_modelo?: string;
  ano_fabricacao?: string;
  fieldSort?: string[];
  is_reserva?: '0' | '1';
  orderSort?: string[];
};

const formatPrefixos = (prefixos: Prefixo[]) => {
  const resposta = prefixos?.map(({ id_veiculo, ...prefixo }) => {
    return {
      ...prefixo,
      emprego: {
        value: prefixo.emprego,
        label: Object.entries(EEmprego).find(
          emprego => emprego[1] === prefixo.emprego,
        )?.[0],
      },
    };
  });

  return resposta;
};

const formatReferenciasPneus = (referenciasPneus: Pneu[]) => {
  const formatedReferencia = referenciasPneus?.map(
    ({ id_pneu, referencia }) => {
      return {
        label: referencia,
        value: id_pneu,
      };
    },
  );
  return formatedReferencia;
};

function sortAquisicao(a: Aquisicao, b: Aquisicao): number {
  if (a.criado_em < b.criado_em) return 1;
  if (b.criado_em < a.criado_em) return -1;
  return 0;
}

function orderVeiculos(veiculos: Veiculo[]): Veiculo[] {
  return veiculos.map(veiculo => {
    if (veiculo.aquisicoes) veiculo.aquisicoes.sort(sortAquisicao);

    return veiculo;
  });
}

@injectable()
@singleton()
class CoreVeiculos {
  constructor(
    @inject('UnidadesRepository')
    private unidadesRepository: IUnidadesRepository,

    @inject('VeiculosRepository')
    private veiculosRepository: IVeiculosRepository,

    @inject('IdentificadoresRepository')
    private identificadoresRepository: IIdentificadoresRepository,

    @inject('KmsRepository')
    private kmsRepository: IKmsRepository,

    @inject('SituacoesVeiculoRepository')
    private situacoesVeiculoRepository: ISituacoesRepository,

    /* @inject('MovimentacoesRepository')
    private movimentacoesRepository: IMovimentacoesRepository,

    @inject('MovimentacoesFasesRepository')
    private movimentacoesFasesRepository: IMovimentacoesFasesRepository,

    @inject('MovimentacoesTransferenciaRepository')
    private movimentacoesTransferenciaRepository: IMovimentacoesTransferenciasRepository,

    @inject('DadosMovimentacoesMudancasVeiculosRepository')
    private dadosMovimentacoesMudancasVeiculosRepository: IDadosMovimentacoesMudancasVeiculosRepository, */

    @inject('VeiculosPneusRepository')
    private veiculosPneusRepository: IVeiculosPneusRepository,


    @inject('VeiculosLocalizacoesRepository')
    private veiculosLocalizacoesRepository: IVeiculosLocalizacoesRepository,
  ) { }


  public async create({
    file,
    criado_por,
    is_reserva,
    ...values
  }: InputData): Promise<object | undefined> {
    let referenciasPneusResponse;
    /* let prefixoResponse;
    let aquisicaoResponse;
    let identificadorResponse;
    let movimentacaoResponse; */
    let result;

    const coreAquisicao = container.resolve(CoreAquisicao);

    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const {
        aquisicao,
        prefixo,
        identificador,
        uf,
        referenciasPneus,
        km,
        ...restValues
      } = values;

      const rest = {
        ...restValues,
        numero_crv: restValues.numero_crv?.trim(),
        codigo_seguranca_crv: restValues.codigo_seguranca_crv?.trim(),
        placa: restValues.placa?.trim(),
        renavam: restValues.renavam?.trim(),
        chassi: restValues.chassi.trim(),
      };

      // situacao Tipo operando
      const idsituacaoTipo = 4;

      const [opmColog] = await Promise.all([
        this.unidadesRepository.findById(opmCologId),
        this.unidadesRepository.findById(opmNUGCMOTId),
      ]);

      if (!opmColog && !opmNUGCMOTId)
        throw new AppError('Não pode criar veiculo sem Id COLOG/NUGCMOT');

      /* const formatedUnidade = unidadesView.render(opmColog); */

      const valorFipe = rest.valor_fipe
        ? Number.parseFloat(rest.valor_fipe)
        : 0;

      // inserindo Veiculo

      const veiculoResponse = await this.veiculosRepository.create(
        {
          ...rest,
          id_situacao_tipo: idsituacaoTipo,
          uf,
          criado_por,
          orgao_tombo: rest.orgao_tombo || undefined,
          tombo: rest.tombo || undefined,
          numero_motor: rest.numero_motor || undefined,
          numero_doc_carga: rest.numero_doc_carga || undefined,
          ano_fabricacao: rest.ano_fabricacao?.toString(),
          ano_modelo: rest.ano_modelo?.toString(),
          chassi: rest.chassi,
          combustivel: rest.combustivel,
          data_operacao: rest.data_operacao,
          data_doc_carga: rest.data_doc_carga,
          valor_fipe: Number.isNaN(valorFipe) ? 0 : valorFipe,
          is_reserva:
            // eslint-disable-next-line no-nested-ternary
            is_reserva === true ? '1' : is_reserva === false ? '0' : undefined,
        } as Veiculo,
        queryRunner,
      );

      if (referenciasPneus) {
        const referenciasPneusToInsert = queryRunner.manager.create(
          VeiculoPneu,
          referenciasPneus.map(referenciaPneu => ({
            id_veiculo: (veiculoResponse as Veiculo).id_veiculo,
            id_referencia_pneu: referenciaPneu.id_pneu,
            criado_por,
          })),
        );

        referenciasPneusResponse = await queryRunner.manager.save(
          VeiculoPneu,
          referenciasPneusToInsert,
        );
      }

      // inserindo o KM

      const insertedKM = await this.kmsRepository.create(
        {
          km_atual: km || 0,
          id_veiculo: veiculoResponse.id_veiculo,
          data_km: new Date(),
          criado_por,
        } as Km,
        queryRunner,
      );

      // inserindo prefixo
      if (prefixo) {
        const { emprego, prefixo_sequencia, prefixo_tipo } = prefixo;

        if (emprego && prefixo_sequencia && prefixo_tipo) {
          const prefixoToInsert = queryRunner.manager.create(Prefixo, {
            ...prefixo,
            emprego: prefixo.emprego,
            id_veiculo: veiculoResponse.id_veiculo,
            criado_por,
          });

          await queryRunner.manager.save(Prefixo, prefixoToInsert);
        }
      }

      // inserindo situacao

      const situacaoResponse = await this.situacoesVeiculoRepository.create(
        {
          id_situacao_tipo: idsituacaoTipo, // situacao de operando possui Id 4
          id_veiculo: veiculoResponse.id_veiculo,
          id_km: insertedKM.id_km,
          data_situacao: new Date(),
          observacao: 'Criacao ',
          criado_por,
        } as SituacaoVeiculo,
        queryRunner,
      );

      /* // inserindo movimentacao
      movimentacaoResponse = await this.movimentacoesRepository.create(
        {
          criado_por,
          id_veiculo: veiculoResponse.id_veiculo,
          observacao: 'Criação de Veiculo',

          tipo_movimentacao: 1,
        } as Movimentacao,
        queryRunner,
      );

      // inserindo dados da movimentacao
      const dadoInserted = await this.dadosMovimentacoesMudancasVeiculosRepository.create(
        {
          id_opm_origem: opmCologId,
          autoridade_origem: formatedUnidade.getComandante,
          id_movimentacao: movimentacaoResponse.id_movimentacao,
          assinado_origem: '1',
        } as DadoMovimentacaoMudancaVeiculo,
        queryRunner,
      );

      // inserindo dados da movimentacao transferencia
      await this.movimentacoesTransferenciaRepository.create(
        {
          id_opm_destino: opmCologId,
          id_dado_movimentacao_mudanca:
            dadoInserted.id_dado_movimentacao_mudanca,
        } as MovimentacaoTransferencia,
        queryRunner,
      );

      await this.movimentacoesFasesRepository.create(
        {
          id_tipo_fase: EFase.Recebimento,
          id_movimentacao: movimentacaoResponse.id_movimentacao,
          obs: 'Criacao de Veiculo',
          criado_por,
        } as MovimentacaoFase,
        queryRunner,
      ); */

      const veiculoCargaTransferenciaToInsert = queryRunner.manager.create(
        VeiculoCargaTransferencia,
        {
          opm_carga: !is_reserva ? opmCologId : opmNUGCMOTId,
          opm_carga_lob: '2021',
          id_veiculo: veiculoResponse.id_veiculo,
          data_carga: new Date().toISOString(),
          criado_por,
        },
      );

      await queryRunner.manager.save(
        VeiculoCargaTransferencia,
        veiculoCargaTransferenciaToInsert,
      );

      // let aquisicaoResponse;

      const identificadorCore = container.resolve(CoreIdentificador);

      const identificadorResponse = await identificadorCore.setIdentificador(
        identificador,
        criado_por,
        queryRunner,
        veiculoResponse,
      );

      const aquisicaoResponse = await coreAquisicao.create(
        { ...aquisicao, id_veiculo: veiculoResponse.id_veiculo, criado_por },
        queryRunner,
        file,
      );

      await queryRunner.commitTransaction();

      result = {
        // filename,
        km: insertedKM.km_atual || undefined,
        ...veiculoResponse,
        // prefixo: prefixoResponse && prefixoResponse,
        // ...movimentacaoResponse,
        aquisicoes: [aquisicaoResponse],
        identificadores: identificadorResponse,
        situacoes: situacaoResponse,
        referenciasPneus: referenciasPneusResponse,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof SyntaxError) throw new AppError('Dados Invalidos');

      if (error instanceof QueryFailedError) {
        throw new AppError(error.message);
      }
      throw new AppError(error.message);
    } finally {
      await queryRunner.release();
    }

    return result;
  }


  public async update({
    id,
    body,
    atualizado_por,
  }: IRequestUpdate): Promise<object | undefined> {
    const veiculoExists = await this.veiculosRepository.findById(id);
    if (!veiculoExists) {
      throw new AppError('Veículo não existe!');
    }

    let result;
    const veiculoFormated = { ...veiculoExists };

    delete veiculoFormated.veiculoOrgao;
    delete veiculoFormated.veiculoEspecie;
    delete veiculoFormated.veiculoMarca;
    delete veiculoFormated.veiculoModelo;
    delete veiculoFormated.prefixos;
    delete veiculoFormated.veiculoOrgao;
    delete veiculoFormated.renavam;
    delete veiculoFormated.is_reserva;

    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const {
        referenciasPneus,
        ano_fabricacao,
        ano_modelo,
        numero_motor,
        placa,
        orgao_tombo,
        tipo_doc_carga,
        data_operacao,
        is_reserva,
        ...restUpdateVeiculo
      } = body;

      if (referenciasPneus) {
        const pneusToUpdate = veiculoFormated.referenciasPneus.filter(pneu => {
          return (
            referenciasPneus.findIndex(
              referencia => referencia.id_pneu === pneu.id_referencia_pneu,
            ) > -1
          );
        });

        const pneusToCreate = referenciasPneus.filter(pneu => {
          return (
            veiculoFormated.referenciasPneus.findIndex(
              referencia => referencia.id_referencia_pneu === pneu.id_pneu,
            ) < 0
          );
        });

        const pneusToDelete = veiculoFormated.referenciasPneus
          .filter(pneu => !pneusToUpdate.includes(pneu))
          .filter(
            pneu =>
              referenciasPneus.findIndex(
                referencia => referencia.id_pneu === pneu.id_referencia_pneu,
              ) < 0,
          );

        delete veiculoFormated.referenciasPneus;

        await this.veiculosPneusRepository.create(
          pneusToCreate.map(
            pneu =>
              ({
                criado_por: atualizado_por,
                id_referencia_pneu: pneu.id_pneu,
                id_veiculo: veiculoFormated.id_veiculo,
              } as VeiculoPneu),
          ),
          queryRunner,
        );

        if (pneusToUpdate.length > 0)
          this.veiculosPneusRepository.update(
            pneusToUpdate,
            pneusToUpdate.map(
              pneu => ({
                ...pneu,
                id_veiculo: Number.parseInt(id, 10),
                atualizado_por,
              }),
              queryRunner,
            ),
          );

        if (pneusToDelete.length > 0)
          this.veiculosPneusRepository.delete(pneusToDelete);
      }

      const veiculoUpdated = await this.veiculosRepository.update(
        veiculoFormated,
        {
          ...restUpdateVeiculo,
          orgao_tombo: (orgao_tombo || null) as number,
          numero_motor: (numero_motor || null) as string,
          placa: (placa || null) as string,
          ano_fabricacao: ano_fabricacao?.toString(),
          ano_modelo: ano_modelo?.toString(),
          tipo_doc_carga: (tipo_doc_carga || null) as ETipoDocCarga,
          data_operacao: (data_operacao || null) as Date,
          atualizado_por,
          is_reserva:
            // eslint-disable-next-line no-nested-ternary
            is_reserva === true ? '1' : is_reserva === false ? '0' : undefined,
        } as Partial<Veiculo>,
        queryRunner,
      );

      await queryRunner.commitTransaction();

      const veiculoReloaded = await this.veiculosRepository.findById(
        (veiculoUpdated as Veiculo).id_veiculo.toString(),
      );
      result = veiculoReloaded;
    } catch (error) {
      console.log(error.query);
      console.log(error.params);

      await queryRunner.rollbackTransaction();
    } finally {
      // you need to release query runner which is manually created:
      await queryRunner.release();
    }

    if (!result) throw new AppError('Não pode atualizar veiculo');

    return result;
  }

  public async show(id: string): Promise<object | undefined> {
    const veiculo = await this.veiculosRepository.findById(id);
    if (!veiculo) {
      throw new AppError('Veículo não existe', 404);
    }

    if (veiculo.aquisicoes) veiculo.aquisicoes.sort(sortAquisicao);

    const { referenciasPneus, ...rest } = veiculo;
    const veiculoResult = {
      ...rest,
      prefixos: formatPrefixos(veiculo?.prefixos),
      referenciasPneus: formatReferenciasPneus(
        referenciasPneus.map(referencia => referencia.pneu),
      ),
    };

    return veiculoResult;
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

  public async list({
    page,
    perPage,
    query,
    fields,
    renavam,
    placa,
    chassi,
    opms,
    ids_situacoes_veiculos,
    ids_situacoes_veiculos_especificos,
    fieldSort,
    is_reserva: reserva,
    orderSort,
    ...rest
  }: IRequestList): Promise<IResponse | object[] | undefined> {
    const formatedOpms = opms ? this.getNumbersArray(opms) : [];

    if (formatedOpms.length > 500)
      throw new AppError('Quantidade de opms excede a lob');

    let formatedSituacoes;
    let formatedSubTipoSituacoes;

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

    if (ids_situacoes_veiculos)
      formatedSituacoes = this.getNumbersArray(ids_situacoes_veiculos);

    if (ids_situacoes_veiculos_especificos) {
      formatedSubTipoSituacoes = this.getNumbersArray(
        ids_situacoes_veiculos_especificos,
      );
    }
    let veiculos;
    let total;
    if (renavam) {
      [veiculos, total] = await this.veiculosRepository.findByRenavam(renavam);
      if (veiculos.length) veiculos = orderVeiculos(veiculos);
    } else if (placa) {
      [veiculos, total] = await this.veiculosRepository.findByPlaca(placa);
      if (veiculos.length) veiculos = orderVeiculos(veiculos);
    } else if (chassi) {
      [veiculos, total] = await this.veiculosRepository.findByChassi(chassi);
      if (veiculos.length) veiculos = orderVeiculos(veiculos);
    } else {
      [veiculos, total] = await this.veiculosRepository.findVeiculos(
        Number(page),
        Number(perPage),
        query,
        {
          opms: formatedOpms,
          ids_situacoes_veiculos: formatedSituacoes,
          ids_situacoes_veiculos_especificos: formatedSubTipoSituacoes,
          is_reserva: reserva,
          ...rest,
        },
        fields,
        fieldSort,
        orderSort,
      );
    }

    veiculos = await Promise.all(
      veiculos.map(async veiculo => {
        const {
          aquisicoes,
          identificadores,
          veiculoMarca,
          veiculoModelo,
          veiculoCarga,
          situacaoTipoAtual,
          situacaoTipoEspecificacaoAtual,
          is_reserva,
          localizacoes,
          ...restVeiculo
        } = veiculo;

        const [km, identificador] = await Promise.all([
          this.kmsRepository.findLastKmByIdVeiculo(veiculo.id_veiculo),

          this.identificadoresRepository.findById(
            identificadores[0].id_identificador,
          ),
        ]);

        return {
          ...restVeiculo,
          km: km.km_atual,
          opm: veiculoCarga.unidade.uni_nome,
          opm_sigla: veiculoCarga.unidade.uni_sigla,
          aquisicao: aquisicoes?.[0]?.origem_aquisicao,
          modelo: veiculoModelo.nome,
          marca: veiculoMarca.nome,
          identificador: identificador?.identificador,
          especie: EEspecieVeiculo[veiculo.id_veiculo_especie],
          situacao: situacaoTipoAtual.nome,
          localizacao: localizacoes?.[0]?.localizacao,
          motivo: situacaoTipoEspecificacaoAtual?.especificacao,
          is_reserva,
        };
      }),
    );

    const orderKmIdentificadorAquisicao = [];
    const orderTypeKmIdentificadorAquisicao = [];

    if (fieldSort && orderSort) {
      const indexKm = fieldSort.findIndex(field => field === 'km');
      if (indexKm >= 0) {
        orderKmIdentificadorAquisicao.push(fieldSort[indexKm]);
        orderTypeKmIdentificadorAquisicao.push(orderSort[indexKm]);
      }

      const indexIdentificador = fieldSort.findIndex(
        field => field === 'identificador',
      );
      if (indexIdentificador >= 0) {
        orderKmIdentificadorAquisicao.push(fieldSort[indexIdentificador]);
        orderTypeKmIdentificadorAquisicao.push(orderSort[indexIdentificador]);
      }
    }

    return {
      total: total as number,
      totalPage: Math.ceil((total as number) / Number(perPage)),
      items:
        orderKmIdentificadorAquisicao.length > 0
          ? orderBy(
            // eslint-disable-next-line prettier/prettier
            veiculos,
            orderKmIdentificadorAquisicao,
            orderTypeKmIdentificadorAquisicao as ('desc' | 'asc')[],
          )
          : veiculos,
    };
  }

  public async showAnosFabricacao(opms: string): Promise<string[]> {
    const formatedOpms = this.getNumbersArray(opms);
    const anos = await this.veiculosRepository.findAllAnoFabricacao(
      formatedOpms,
    );
    return anos.reduce((anosFormated, veiculo) => {
      if (anosFormated.includes(veiculo.ano_fabricacao))
        return [...anosFormated];
      return [...anosFormated, veiculo.ano_fabricacao];
    }, [] as string[]);
  }

  public async showModelos(
    opms: string,
    page?: string,
    perPage?: string,
  ): Promise<IResponse> {
    if (!page && !perPage && !!page && !!perPage)
      throw new AppError('Parametros de paginacao inválidos');

    const opmsNumber = this.getNumbersArray(opms);

    let veiculos: Pick<Veiculo, 'id_modelo' | 'veiculoModelo'>[];
    let total;
    let finalResult;
    if (page && perPage) {
      const pageNumber = Number.parseInt(page.toString(), 10);
      const perPageNumber = Number.parseInt(perPage.toString(), 10);

      if (Number.isNaN(pageNumber) || Number.isNaN(perPageNumber))
        throw new AppError('Valores invalidos de paginação');

      [veiculos, total] = await this.veiculosRepository.findAllModelosByOpms(
        opmsNumber,
        pageNumber,
        perPageNumber,
      );

      finalResult = {
        total,
        totalPage: Math.ceil(total / Number(perPage)),
      };
    } else {
      [veiculos, total] = await this.veiculosRepository.findAllModelosByOpms(
        opmsNumber,
      );

      finalResult = {
        total,
        totalPage: 1,
      };
    }

    const modelos = veiculos
      .map(veiculo => ({ ...veiculo.veiculoModelo }))
      .reduce(
        (modelosFormated, currentModelo) => {
          if (
            !modelosFormated.find(
              modelo =>
                modelo.id_veiculo_modelo === currentModelo.id_veiculo_modelo,
            )
          )
            return [...modelosFormated, currentModelo];

          return [...modelosFormated];
        },
        [] as {
          id_veiculo_modelo: number;
          id_veiculo_marca: number;
          id_veiculo_especie: number;
          nome: string;
          criado_por: string;
          criado_em: Date;
        }[],
      );

    return { items: modelos, ...finalResult };
  }

  public async showFrota({
    aquisicao,
    especies,
    empregos,
    situacao,
    opms,
  }: IGetFrota): Promise<number> {
    if (!Object.values(EOrigemDeAquisicao).includes(aquisicao))
      throw new AppError('Tipo de origem de aquisicao invalido');

    const valuesEspecies = Object.values(EEspecieVeiculo);
    const valuesEmpregos = Object.values(EEmprego);

    if (!especies.filter(especie => valuesEspecies.includes(especie)).length)
      throw new AppError('Tipo(s) de especie(s) invalido(s)');

    if (!empregos.filter(emprego => valuesEmpregos.includes(emprego)).length)
      throw new AppError('Tipo(s) de empregos(s) invalido(s)');

    const formatedSituacao =
      situacao.length > 0 ? Number.parseInt(situacao, 10) : Number.NaN;
    if (Number.isNaN(formatedSituacao))
      throw new AppError('Tipo de situacao invalido');

    const opmsFormated = opms.map(opm => {
      const numberOpm = Number.parseInt(opm, 10);
      if (Number.isNaN(numberOpm))
        throw new AppError('Formato(s) invalido(s) de opms');

      return numberOpm;
    });

    return this.veiculosRepository.countVeiculos({
      aquisicao,
      empregos,
      especies,
      situacao: formatedSituacao,
      opms: opmsFormated,
    });
  }

  public async getLocaisExternos({
    opms,
    query,
    page,
    perPage,
    fieldSort,
    orderSort,
    fields,
  }: IGetLocaisExternos): Promise<IResponseGetVeiculosLocalizacoes> {
    const opmsFormated = this.getNumbersArray(opms);

    if (page && !perPage)
      throw new AppError('Paginação necessita do quantidade por pagina');

    if (!page && perPage)
      throw new AppError('Paginação necessita do número da página');

    if (!!fieldSort && !orderSort)
      throw new AppError(
        'Ordernação dos campos necessita saber a forma de ordenção',
      );

    if (!fieldSort && !!orderSort)
      throw new AppError('Ordernação saber quais campos serão ordernados');

    if (fieldSort?.length !== orderSort?.length)
      throw new AppError(
        'Quantidade de campos de ordenação e suas formas não são compativeis',
      );

    let total;
    let items;

    if (page && perPage) {
      [
        items,
        total,
      ] = await this.veiculosLocalizacoesRepository.findLocalizacoes(
        page,
        perPage,
        query,
        { opms: opmsFormated, fieldSort, orderSort, fields },
      );
    } else {
      [
        items,
        total,
      ] = await this.veiculosLocalizacoesRepository.findLocalizacoes(
        NaN,
        NaN,
        query,
        { opms: opmsFormated, fieldSort, orderSort, fields },
      );
    }

    const response = {
      items,
      total,
    };

    return {
      totalPage: page && perPage ? Math.ceil(total / Number(perPage)) : 1,
      ...response,
    };
  }
}

export default CoreVeiculos;
