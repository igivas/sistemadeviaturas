import { inject, injectable } from 'tsyringe';
import * as Yup from 'yup';
import AppError from '../../../errors/AppError';
import ICheckRepository from '../repositories/interfaces/ICheckRepository';
import IMovimentacoesFasesRepository from '../repositories/interfaces/IMovimentacoesFasesRepository';
import IMovimentacoesRepository from '../repositories/interfaces/IMovimentacoesRepository';
import ISituacoesRepository from '../repositories/interfaces/ISituacoesRepository';
import { requiredField } from '../utils/fieldsMessageValidation';
import EFase from '../enums/EFase';
import MovimentacaoFase from '../entities/MovimentacaoFase';

const veiculoCheckSchema = Yup.object({
  chassi: Yup.string().notRequired(),
  placa: Yup.string()
    .notRequired()
    .matches(/^[a-zA-Z]{3}[0-9][0-9a-zA-Z][0-9]{2}$/, 'Placa inválida'),
  numero_crv: Yup.string().trim().notRequired().nullable(true),
  renavam: Yup.string().trim().notRequired().nullable(true),
  codigo_seguranca_crv: Yup.string().trim().notRequired().nullable(true),
}).default(undefined);

const prefixoCheckschema = Yup.object({
  prefixo_tipo: Yup.string().notRequired(),
  prefixo_sequencia: Yup.string().required(requiredField('Prefixo Sequência')),
})
  .notRequired()
  .default(undefined);

const movimentacaoCheckSchema = Yup.object({
  id_veiculo: Yup.number()
    .required(requiredField('Id veiculo'))
    .typeError('Valor de identificacao do veiculo invalido'),
  data_movimentacao: Yup.date()
    .typeError('Data da movimentacao invalida')
    .required('Data da movimentacao é requerido'),
})
  .notRequired()
  .default(undefined);

const identificadorCheckSchema = Yup.object({
  nome: Yup.string()
    .notRequired()
    .uppercase('Identificador deve ser em letra maiúscula')
    .trim(),
  data_identificador: Yup.date().notRequired().typeError('Data invalida'),
}).notRequired();

export const schemaCheck = Yup.object()
  .shape({
    prefixo: prefixoCheckschema,
    veiculo: veiculoCheckSchema,
    movimentacao: movimentacaoCheckSchema,
    identificador: identificadorCheckSchema,
  })
  .required('Entre com o formato de checagem válido')
  .test('noValue', 'Nenhum valor Fornecido', check => {
    const veiculoExist = !!check?.veiculo;
    const prefixoExist = !!check?.prefixo;
    const movimentacaoExist = !!check?.movimentacao;
    const identificadorExist = !!check?.identificador;

    if (veiculoExist || prefixoExist || movimentacaoExist || identificadorExist)
      return true;

    return false;
  });

export type SchemaCheck = Yup.InferType<typeof schemaCheck>;

@injectable()
export default class CheckService {
  constructor(
    @inject('ICheckRepository')
    private checkRepository: ICheckRepository,

    @inject('MovimentacoesRepository')
    private movimentacoesRepository: IMovimentacoesRepository,

    @inject('MovimentacoesFasesRepository')
    private movimentacoesFasesRepository: IMovimentacoesFasesRepository,

    @inject('SituacoesVeiculoRepository')
    private situacoesRepository: ISituacoesRepository,
  ) {}

  async execute(checkValues: SchemaCheck): Promise<object | undefined> {
    let response;
    let erroMsg = '';

    const sanitazedCheckValues = schemaCheck.cast(checkValues, {
      stripUnknown: true,
    });
    const validatedValues = await schemaCheck.validate(sanitazedCheckValues, {
      abortEarly: false,
    });

    const { prefixo, veiculo, movimentacao, identificador } = validatedValues;

    if (prefixo) {
      response = await this.checkRepository.checkPrefixo(prefixo);
      if (response) {
        erroMsg = `Veiculo de chassi ${response?.veiculo.chassi} já possui prefixo sequência ${prefixo.prefixo_sequencia}`;
      }
    }

    if (veiculo) {
      response = await this.checkRepository.checkVeiculo({
        chassi: veiculo.chassi ? veiculo.chassi : undefined,
        codigo_seguranca_crv: veiculo.codigo_seguranca_crv
          ? veiculo.codigo_seguranca_crv
          : undefined,
        numero_crv: veiculo.numero_crv ? veiculo.numero_crv : undefined,
        placa: veiculo.placa ? veiculo.placa : undefined,
        renavam: veiculo.renavam ? veiculo.renavam : undefined,
      });
      if (response) {
        const arrayfieldsVeiculo = veiculo.chassi ? [veiculo.chassi] : [];

        if (veiculo.numero_crv) arrayfieldsVeiculo.push(veiculo.numero_crv);
        if (veiculo.placa) arrayfieldsVeiculo.push(veiculo.placa);
        if (veiculo.renavam) arrayfieldsVeiculo.push(veiculo.renavam);
        if (veiculo.codigo_seguranca_crv)
          arrayfieldsVeiculo.push(veiculo.codigo_seguranca_crv);

        erroMsg = `Um veiculo ja possui algum este(s) campo(s) ${
          arrayfieldsVeiculo.length > 1
            ? arrayfieldsVeiculo.join(',').replace(/,,/, '')
            : arrayfieldsVeiculo.join(',').replace(/,,/, '').replace(/,,/, ',')
        }`;
      }
    }
    if (identificador && identificador.nome) {
      const { data_identificador, nome } = identificador;

      response = await this.checkRepository.checkIdentifcadorIsActive(
        nome as string,
        data_identificador,
      );
      if (response) erroMsg = 'Identificador já existente';
    }

    if (movimentacao) {
      const [
        movimentacaoBeforeDataMovimentacao,
        movimentacaoAfterDataMovimentacao,
      ] = await Promise.all([
        this.movimentacoesRepository.findMovimentacaoBeforeOrEqualDataMovimentacao(
          movimentacao.data_movimentacao,
          movimentacao.id_veiculo,
        ),
        this.movimentacoesRepository.findMovimentacaoAfterDataMovimentacao(
          movimentacao.data_movimentacao,
          movimentacao.id_veiculo,
        ),
      ]);

      if (movimentacaoBeforeDataMovimentacao) {
        // falta achar se a fase da movimentacao é oferta e se a situacao é de operando

        response = await this.movimentacoesFasesRepository.findLastMovimentacaoByIdMovimentacao(
          movimentacaoBeforeDataMovimentacao.id_movimentacao,
        );
      } else if (movimentacaoAfterDataMovimentacao) {
        response = await this.movimentacoesFasesRepository.findLastMovimentacaoByIdMovimentacao(
          movimentacaoAfterDataMovimentacao.id_movimentacao,
        );
      }

      if (
        (response as MovimentacaoFase)?.id_tipo_fase === EFase.Oferta ||
        (response as MovimentacaoFase)?.id_tipo_fase === EFase.Concessão
      )
        erroMsg = `Veiculo ja está em oferta ou em concessão em virtude movimentação cuja da data é ${
          movimentacaoBeforeDataMovimentacao
            ? movimentacaoBeforeDataMovimentacao.data_movimentacao.toString()
            : ''
        }${
          movimentacaoAfterDataMovimentacao
            ? movimentacaoAfterDataMovimentacao.data_movimentacao.toString()
            : ''
        }`;
      else response = undefined;
    }

    if (!response) return response;
    throw new AppError(erroMsg);
  }
}
