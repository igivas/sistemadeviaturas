import { injectable, inject, singleton, container } from 'tsyringe';
import IUnidadesRepository from '@modules/public/repositories/interfaces/IUnidadesRepository';
import { getConnection, QueryRunner } from 'typeorm';
import getStream from 'get-stream';
import { AxiosError } from 'axios';
import FormData from 'form-data';
import IUsuariosRepository from '@modules/seg/repositories/interfaces/IUsuariosRepository';
import IPessoasFisicasPmsRepository from '@modules/public/repositories/interfaces/IPessoasFisicasPmsRepository';
import unidades_view from '../../../views/unidades_view';
import AppError from '../../../errors/AppError';
import IVeiculosRepository from '../repositories/interfaces/IVeiculosRepository';
import { IPostDocument } from '../interfaces/request/IPostDocumento';
import PdfContext from '../patterns/strategy/PdfContext';
import MovimentacaoTransferenciaPdfKit from '../patterns/template/MovimentacaoTransferenciaPdfKit';
import { IDocumentInfo } from '../interfaces/patterns/template/IAbstractPdf';
import IDocumentosRepository from '../repositories/interfaces/IDocumentosRepository';
import Documento from '../entities/Documento';
import ETipoDocumento from '../enums/ETipoDocumento';
import { IPostResponseDocumentoSGA } from '../interfaces/response/IPostResponseDocumentoSGA';
import api from '../../../services/api';
import { IPostAssinarDocumento } from '../interfaces/request/IPostAssinarDocumento';
import { IResponseAssinaturaSGA } from '../interfaces/response/IResponseAssinaturaSGA';
import { IResponseCreatePin24h } from '../interfaces/response/IResponseCreatePin24h';
import CoreKm from './CoreKm';
import { IPostMovimentacaoDocument } from '../interfaces/request/IPostMovimentacaoDocument';

@injectable()
@singleton()
export default class CoreDocumento {
  private oficio: Documento;

  constructor(
    @inject('VeiculosRepository')
    private veiculosRepository: IVeiculosRepository,

    @inject('UnidadesRepository')
    private unidadesRepository: IUnidadesRepository,

    @inject('DocumentosRepository')
    private oficiosRepository: IDocumentosRepository,

    @inject('UsuariosRepository')
    private usuariosRepository: IUsuariosRepository,

    @inject('PessoasFisicasPmsPublicRepository')
    private pessoaRepository: IPessoasFisicasPmsRepository,
  ) {}

  async createDocumento(
    { movimentacao, user_id }: IPostDocument,
    defaultQueryRunner?: QueryRunner,
  ): Promise<IPostResponseDocumentoSGA> {
    const pdfContext = new PdfContext();

    let queryRunner;

    if (defaultQueryRunner) {
      queryRunner = defaultQueryRunner;
    } else {
      const connection = getConnection();
      queryRunner = connection.createQueryRunner();

      await queryRunner.connect();
      await queryRunner.startTransaction();
    }

    let usuariosCPFs;

    const actualDateYear = new Date().getFullYear();

    let documento = pdfContext as any;

    const lastOficioByYear = await this.oficiosRepository.findLastDocumentoByYear(
      actualDateYear,
    );

    try {
      if (lastOficioByYear) {
        this.oficio = await this.oficiosRepository.create(
          {
            ano_documento: actualDateYear,
            criado_por: user_id,
            numero_documento: lastOficioByYear.numero_documento + 1,
            tipo_documento: ETipoDocumento.Oficio,
          } as Documento,
          queryRunner,
        );
      } else {
        this.oficio = await this.oficiosRepository.create(
          {
            ano_documento: actualDateYear,
            criado_por: user_id,
            numero_documento: 1,
            tipo_documento: ETipoDocumento.Oficio,
          } as Documento,
          queryRunner,
        );
      }

      const numeroOficio = `${this.oficio.numero_documento.toString().padStart(
        // eslint-disable-next-line no-nested-ternary

        this.oficio.numero_documento < 100 ? 3 : 0,
        '0',
      )}/${this.oficio.ano_documento}`;

      const coreKm = container.resolve(CoreKm);

      if (movimentacao) {
        const {
          id_veiculo,
          id_tipo_movimentacao,
          id_opm_origem,
          id_opm_destino,
          data_movimentacao,
          id_opm_mediadora,
        } = movimentacao;
        const [veiculo, opmOrigem, opmDestino] = await Promise.all([
          this.veiculosRepository.findById(id_veiculo),
          this.unidadesRepository.findById(id_opm_origem),
          this.unidadesRepository.findById(id_opm_destino),
        ]);

        if (!opmOrigem || !opmDestino)
          throw new AppError('Não pode encontrar um das opms');

        if (!opmOrigem) throw new AppError('Necessita de opm mediadora');

        const usuariosPMs = await this.usuariosRepository.findAllPMsByIdSistema();

        if (usuariosPMs.length < 1)
          throw new AppError('Não achou usuarios para este sistema');

        const usuariosPms = await Promise.all(
          usuariosPMs.map(async pm =>
            this.pessoaRepository.findByIdOpmAndUsuCodigo(
              [
                opmOrigem.uni_codigo,
                opmDestino.uni_codigo,
                id_opm_mediadora as number,
              ],
              pm.usu_codigo,
            ),
          ),
        );

        usuariosCPFs = [
          ...usuariosPms.map(usuario => usuario?.pm_cpf).filter(cpf => !!cpf),
        ];

        if (usuariosCPFs.length < 0)
          throw new AppError(
            'Não encontrou usuarios para as unidades de origem e destino',
          );

        const [
          formatedOpmOrigem,
          formatedOpmDestino,
        ] = unidades_view.renderMany([opmOrigem, opmDestino]);

        if (!veiculo) throw new AppError('Veiculo não encontrado');

        const kmBeforeDate = coreKm.findVeiculoKmBeforeDate(
          veiculo.id_veiculo,
          data_movimentacao,
        );

        if (id_tipo_movimentacao) {
          const movimentacaoTransferenciaPdfKit = new MovimentacaoTransferenciaPdfKit(
            {
              size: 'A4',
              margins: {
                top: 30,
                bottom: 30,
                left: 20,
                right: 20,
              },
            },
          );

          pdfContext.setStrategy(movimentacaoTransferenciaPdfKit);

          documento = pdfContext.gerarDocumento(
            {
              author: 'movimentacao',
              creationDate: new Date(),
              title: user_id,
            } as IDocumentInfo,
            {
              oficio: numeroOficio,
              dataAtual: new Date(),
              unidadeOrigem: formatedOpmOrigem,
            },
            {
              data_movimentacao,
            } as IPostMovimentacaoDocument,
            {
              unidadeDestino: formatedOpmDestino,
            },
          );

          documento.end();

          documento = await getStream.buffer(documento);
        } else throw new AppError('Nao pode criar documento');
      }

      const formData = new FormData();
      // fs.writeFileSync(`${__dirname}/movimentacao.pdf`, documento);

      formData.append('files', documento, {
        contentType: 'application/pdf',
        filename: 'movimentacao.pdf',
        knownLength: documento.byteLength,
      });

      formData.append('id_sistema', process.env.ID_SISTEMA);
      formData.append('id_tipo_documento', ETipoDocumento.Oficio);
      formData.append('tipo_documento', ETipoDocumento[ETipoDocumento.Oficio]);
      formData.append('id_documento_origem', this.oficio.id_documento);
      formData.append('numero_documento', numeroOficio);
      formData.append(
        'cpfs_interessados',
        (usuariosCPFs as string[])?.length > 1
          ? usuariosCPFs?.join(',').replace(/,,/, '')
          : usuariosCPFs?.join(',').replace(/,,/, '').replace(/,,/, ','),
      );

      const request = await api.post<IPostResponseDocumentoSGA>(
        'documentos',
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            ...api.defaults.headers,
          },
        },
      );

      if (!defaultQueryRunner) {
        await queryRunner.commitTransaction();
        await queryRunner.release();
      }

      return request.data;
    } catch (error) {
      if (!defaultQueryRunner) await queryRunner.rollbackTransaction();

      if ((error as AxiosError).isAxiosError)
        throw new AppError('Não pode enviar arquivo para o SGA');
      throw error;
    }
  }

  async deleteOficio(): Promise<Documento> {
    return this.oficiosRepository.deleDocumento(this.oficio);
  }

  async assinarDocumento(
    dadosAssinatura: IPostAssinarDocumento,
  ): Promise<IResponseAssinaturaSGA> {
    try {
      const responseAssinatura = await api.post<IResponseAssinaturaSGA>(
        'documentos/assinar',
        dadosAssinatura,
      );

      return responseAssinatura.data;
    } catch (error) {
      throw new AppError(error.response.data.message);
    }
  }

  async gerarPin24H(user: string): Promise<IResponseCreatePin24h> {
    try {
      const pin24h = await api.post<IResponseCreatePin24h>('assinaturas/pins', {
        pes_codigo: user,
      });

      return pin24h.data;
    } catch (error) {
      throw new AppError(
        error.response.data.message,
        error.response.data.statusCode,
      );
    }
  }
}
