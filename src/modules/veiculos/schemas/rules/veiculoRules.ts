import { isDate } from 'date-fns';
import * as Yup from 'yup';
import ECombustivel from '@modules/veiculos/enums/ECombustivel';
import ETipoDocCarga from '@modules/veiculos/enums/ETipoDocCarga';
import { EOrigemDeAquisicao } from '@modules/veiculos/enums/EAquisicao';
import { EPrefixoTipo, EEmprego } from '@modules/veiculos/enums/EPrefixo';
import prefixoMapper from '@modules/veiculos/mappers/prefixo';
import {
  maxLengthRequiredField,
  requiredField,
} from '../messages/fieldsMessageValidation';
import { IValidationRules } from '../../interfaces/validation/IValidationRules';

// eslint-disable-next-line import/prefer-default-export
export const createVeiculoRules: IValidationRules = [
  {
    chave: 'prefixo',
    yup: {
      objectExpression: Yup.object({
        prefixo_tipo: Yup.mixed<EPrefixoTipo>().transform(
          (prefixoTipo: string) => prefixoTipo.trim(),
        ),
        prefixo_sequencia: Yup.string(),
        emprego: Yup.mixed<EEmprego>().transform((emprego: string) =>
          emprego.trim(),
        ),
      })
        .notRequired()
        .typeError('Formato de Prefixo invalido')
        .when('aquisicao.origem_aquisicao', {
          is: (origemAquisicao: EOrigemDeAquisicao) =>
            origemAquisicao === EOrigemDeAquisicao.ORGANICO ||
            origemAquisicao === EOrigemDeAquisicao.CESSAO,
          then: Yup.object({
            prefixo_tipo: Yup.mixed<EPrefixoTipo>()
              .oneOf(Object.values(EPrefixoTipo), 'Prefixo tipo invalido')
              .required(requiredField('Prefixo Tipo'))
              .transform((prefixoTipo: string) => prefixoTipo.trim()),
            prefixo_sequencia: Yup.string().required(
              requiredField('Prefixo Sequencia'),
            ),
            emprego: Yup.mixed<EEmprego>()
              .required(requiredField('Emprego'))
              .oneOf(Object.values(EEmprego), 'Tipo de emprego invalido')
              .transform((emprego: string) => emprego.trim()),
          }).required(requiredField('Objeto Prefixo')),
        })
        .test(
          'isIncorrectPrefixoTipo',
          'Emprego e Prefixo Tipo enviados nao se relacionam',
          function (prefixoToValidate) {
            const { prefixo } = this.parent;

            if (!prefixoToValidate) return true;

            const removedUndefinedKeys = Object.entries(prefixoToValidate)
              .filter(([_, v]) => v != null)
              .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});

            if (Object.keys(removedUndefinedKeys).length < 1) return true;

            return prefixoMapper[prefixo.prefixo_tipo as EPrefixoTipo].includes(
              prefixoToValidate.emprego,
            );
          },
        ),
    },
  },

  {
    chave: 'placa',
    yup: {
      expression: Yup.string()
        .trim()
        .matches(/^[a-zA-Z]{3}[0-9][0-9a-zA-Z][0-9]{2}$/, 'Placa inválida')
        .notRequired()
        .uppercase()
        .nullable(true),
    },
  },

  {
    chave: 'chassi',
    yup: {
      expression: Yup.string()
        .uppercase()
        .trim()
        .required(requiredField('Chassi'))
        .max(18, maxLengthRequiredField('Chassi', 18)),
    },
  },

  {
    chave: 'renavam',
    yup: {
      expression: Yup.string()
        .uppercase()
        .trim()
        .notRequired()
        .nullable(true)
        .max(11, maxLengthRequiredField('Renavam', 11))
        .test(
          'apenasNumeros',
          'Renavam deve conter apenas Numeros',
          value => !!(!value || /^[0-9]+$/.test(value)),
        ),
    },
  },

  {
    chave: 'id_veiculo_especie',
    yup: {
      expression: Yup.number()
        .required('Campo de Veiculo de Especie é requerido')
        .typeError('Campo de veiculo especie deve ser um numero'),
    },
  },

  {
    chave: 'id_marca',
    yup: {
      expression: Yup.number()
        .required(requiredField('Marca'))
        .typeError('Campo de marca deve ser um numero'),
    },
  },

  {
    chave: 'id_modelo',
    yup: {
      expression: Yup.number()
        .required(requiredField('Modelo'))
        .typeError('Campo de modelo deve ser um numero'),
    },
  },

  {
    chave: 'id_cor',
    yup: {
      expression: Yup.number()
        .required(requiredField('Cor'))
        .typeError('Campo de cor deve ser um numero'),
    },
  },

  {
    chave: 'uf',
    yup: {
      expression: Yup.number().when('aquisicao.origem_aquisicao', {
        is: (origem_aquisicao?: EOrigemDeAquisicao) =>
          origem_aquisicao === EOrigemDeAquisicao.LOCADO ||
          origem_aquisicao === undefined,
        then: Yup.number()
          .notRequired()
          .typeError('Campo de uf deve ser um numero'),
        otherwise: Yup.number()
          .required(requiredField('Estado'))
          .typeError('Campo de uf deve ser um numero'),
      }),
    },
  },

  {
    chave: 'ano_modelo',
    yup: {
      expression: Yup.number().when('aquisicao.origem_aquisicao', {
        is: (origem_aquisicao?: EOrigemDeAquisicao) =>
          origem_aquisicao === EOrigemDeAquisicao.LOCADO ||
          origem_aquisicao === undefined,
        then: Yup.number().notRequired(),
        otherwise: Yup.number()
          .typeError('Ano modelo invalido')
          .required(requiredField('Ano Modelo'))
          .test(
            'invalidYear',
            'Ano modelo invalido',
            value => !value || /^[0-9]+$/.test(value.toString()),
          ),
      }),
    },
  },

  {
    chave: 'ano_fabricacao',
    yup: {
      expression: Yup.number().when('aquisicao.origem_aquisicao', {
        is: (origem_aquisicao?: EOrigemDeAquisicao) =>
          origem_aquisicao === EOrigemDeAquisicao.LOCADO ||
          origem_aquisicao === undefined,
        then: Yup.number().notRequired(),
        otherwise: Yup.number()
          .typeError('Ano fabricação invalido')
          .required(requiredField('Ano fabricação'))
          .test(
            'invalidYear',
            'Ano fabricação invalido',
            value => !value || /^[0-9]+$/.test(value.toString()),
          ),
      }),
    },
  },

  {
    chave: 'combustivel',
    yup: {
      expression: Yup.mixed<ECombustivel>()
        .when('aquisicao.origem_aquisicao', {
          is: (origem_aquisicao?: EOrigemDeAquisicao) =>
            origem_aquisicao === EOrigemDeAquisicao.LOCADO ||
            origem_aquisicao === undefined,
          then: Yup.mixed<ECombustivel>()
            .notRequired()
            .nullable(true)
            .oneOf(Object.values(ECombustivel)),
          otherwise: Yup.mixed<ECombustivel>()
            .oneOf(Object.values(ECombustivel), 'Tipo de combustivel inválido')
            .required(requiredField('Combustível')),
        })
        .transform((combustivel: string) => combustivel.trim() || undefined),
    },
  },

  {
    chave: 'numero_crv',
    yup: {
      expression: Yup.string()
        .uppercase()
        .trim()
        .notRequired()
        .nullable(true)
        .min(10, 'Minimo de 10 digitos')
        .max(12, 'Maximo de 12 digitos')
        .transform((numero_crv: string) => numero_crv || null)
        .test(
          'apenasNumeros',
          'Numero CRV deve conter apenas Numeros',
          value => !!(!value || value.match(/^[0-9]+$/)),
        ),
    },
  },

  {
    chave: 'codigo_seguranca_crv',
    yup: {
      expression: Yup.string()
        .uppercase()
        .trim()
        .notRequired()
        .nullable(true)
        .length(11, 'Deve conter exatamente 11 digitos')
        .transform(
          (codigo_seguranca_crv: string) => codigo_seguranca_crv || null,
        )
        .test(
          'apenasNumeros',
          'Codigo segurança CRV deve conter apenas Numeros',
          value => !!(!value || /^[0-9]+$/.test(value)),
        ),
    },
  },

  {
    chave: 'numero_motor',
    yup: {
      expression: Yup.string()
        .trim()
        .notRequired()
        .nullable(true)
        .max(20, maxLengthRequiredField('Número Motor', 20)),
      // .test(
      //   'apenasNumeros',
      //   'Numero de motor deve conter apenas Numeros',
      //   value => !!(!value || value.match(/^[0-9]+$/)),
      // )
    },
  },

  {
    chave: 'is_reserva',
    yup: {
      expression: Yup.boolean().when('aquisicao.origem_aquisicao', {
        is: '1',
        otherwise: Yup.boolean().notRequired().nullable(true),
        then: Yup.boolean().required(requiredField('é reserva')),
      }),
    },
  },

  {
    chave: 'valor_fipe',
    yup: {
      expression: Yup.string()
        .uppercase()
        .when('aquisicao.origem_aquisicao', {
          is: (origem_aquisicao?: EOrigemDeAquisicao) =>
            origem_aquisicao === EOrigemDeAquisicao.LOCADO ||
            origem_aquisicao === undefined,
          then: Yup.string().notRequired().nullable(true),
          otherwise: Yup.string().required(requiredField('Valor Fipe')),
        })
        .transform(
          (valor_fipe: string) =>
            valor_fipe.trimLeft().trimRight() || undefined,
        )
        .test(
          'NumeroInvalido',
          'Insira um valor fipe valido',
          value =>
            !value || !!value.match(/^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$/),
        ),
    },
  },

  {
    chave: 'numero_doc_carga',
    yup: {
      expression: Yup.string()
        .notRequired()
        .nullable(true)

        .test(
          'NumeroInvalido',
          'Insira um numero documento carga fipe valido',
          value => !!(!value || /^[0-9]+$/.test(value)),
        ),
    },
  },

  {
    chave: 'data_doc_carga',
    yup: {
      expression: Yup.date()
        .notRequired()
        .nullable(true)
        .typeError('Data invalida')
        .test('isValidDate', `Date is not valid`, value => {
          if ((value && isDate(value)) || !value) return true;
          return false;
        }),
    },
  },

  {
    chave: 'data_doc_carga',
    yup: {
      expression: Yup.date()
        .notRequired()
        .nullable(true)
        .typeError('Data invalida')
        .test('isValidDate', `Date is not valid`, value => {
          if ((value && isDate(value)) || !value) return true;
          return false;
        }),
    },
  },

  {
    chave: 'tipo_doc_carga',
    yup: {
      expression: Yup.mixed<ETipoDocCarga>()
        .oneOf(
          Object.values(ETipoDocCarga),
          'Opção inválida de Tipo Documento Carga',
        )
        .transform((tipo_doc_carga: string) => tipo_doc_carga || undefined)
        .notRequired()
        .nullable(true),
    },
  },

  {
    chave: 'orgao_tombo',
    yup: {
      expression: Yup.number()
        .typeError('Formato de Orgao Tombo invalido')
        .notRequired()
        .nullable(true),
    },
  },

  {
    chave: 'tombo',
    yup: {
      expression: Yup.string()
        .uppercase()
        .notRequired()
        .typeError('Formato de Tombo inválido')
        .max(11, 'No máximo 11 caracteres!')
        .nullable(true),
    },
  },

  {
    chave: 'referenciasPneus',
    yup: {
      arrayExpression: Yup.array()
        .of(
          Yup.object({
            id_pneu: Yup.number()
              .typeError('Valor de Referencia de Pneu Invalido')
              .positive('Numero invalido de referencia de Pneu')
              .required('Id de Referencia de Pneu é requerida'),
          }).required('Referencia de Pneu valido'),
        )
        .when('aquisicao.origem_aquisicao', {
          is: (origem_aquisicao?: EOrigemDeAquisicao) =>
            origem_aquisicao === EOrigemDeAquisicao.LOCADO ||
            origem_aquisicao === undefined,

          then: Yup.array()
            .of(
              Yup.object({
                id_pneu: Yup.number()
                  .typeError('Valor de Referencia de Pneu Invalido')
                  .positive('Numero invalido de referencia de Pneu')
                  .required('Id de Referencia de Pneu é requerida'),
              }).required('Referencia de Pneu valido'),
            )
            .notRequired()
            .nullable(true)
            .typeError('Tipo de referencia de Pneu invalido'),
          otherwise: Yup.array()
            .of(
              Yup.object({
                id_pneu: Yup.number()
                  .typeError('Valor de Referencia de Pneu Invalido')
                  .positive('Numero invalido de referencia de Pneu')
                  .required('Id de Referencia de Pneu é requerida'),
              }).required('Referencia de Pneu valido'),
            )
            .required('Campo de Referencia de Pneu é necessario')
            .typeError('Tipo de referencia de Pneu invalido'),
        }),
    },
  },
  {
    chave: 'data_operacao',
    yup: {
      expression: Yup.date()
        .notRequired()
        .typeError('Data invalida')
        .nullable(true)

        .test('isValidDate', `Data operacao is not valid`, value => {
          if ((value && isDate(value)) || !value) return true;
          return false;
        }),
    },
  },

  {
    chave: 'observacao',
    yup: {
      expression: Yup.string().notRequired(),
    },
  },

  {
    chave: 'km',
    yup: {
      expression: Yup.number()
        .positive('O km não pode ser negativo')
        .notRequired()
        .when('aquisicao.origem_aquisicao', {
          is: (origem_aquisicao: EOrigemDeAquisicao) =>
            origem_aquisicao !== EOrigemDeAquisicao.LOCADO,
          then: Yup.number()
            .required(requiredField('KM'))
            .positive('O km não pode ser negativo'),
        }),
    },
  },
];
