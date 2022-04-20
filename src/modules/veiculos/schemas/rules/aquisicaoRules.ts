import { isDate } from 'date-fns';
import * as Yup from 'yup';
import {
  EOrigemDeAquisicao,
  EFormaDeAquisicao,
} from '@modules/veiculos/enums/EAquisicao';
import { requiredField } from '../messages/fieldsMessageValidation';
import { IValidationRules } from '../../interfaces/validation/IValidationRules';

const maxValueAquisicao = 99000000;

// eslint-disable-next-line import/prefer-default-export
export const createAquisicaoRules: IValidationRules = [
  {
    chave: 'origem_aquisicao',
    yup: {
      expression: Yup.mixed<EOrigemDeAquisicao>()
        .oneOf(Object.values(EOrigemDeAquisicao), 'Origem Aquisicao invalido')
        .required(requiredField('Origem Aquisicao'))
        .transform((origem_aquisicao: string) => origem_aquisicao.trim()),
    },
  },

  {
    chave: 'data_aquisicao',
    yup: {
      expression: Yup.date()
        .required(requiredField('Data Aquisicao'))
        .test('isValidDate', 'Data Aquisicao invalida', value => isDate(value)),
    },
  },

  {
    chave: 'doc_aquisicao',
    yup: {
      expression: Yup.string().notRequired().nullable(true),
    },
  },

  {
    chave: 'forma_aquisicao',
    yup: {
      expression: Yup.mixed<EFormaDeAquisicao>()
        .transform(
          (forma_aquisicao: string) => forma_aquisicao.trim() || undefined,
        )
        .when('origem_aquisicao', {
          is: (value: EOrigemDeAquisicao) =>
            value === EOrigemDeAquisicao.ORGANICO,
          then: Yup.mixed<EFormaDeAquisicao>()
            .required(requiredField('Forma Aquisição'))
            .oneOf(
              Object.values(EFormaDeAquisicao),
              'Forma de aquisicao invalida',
            ),
          otherwise: Yup.mixed<EFormaDeAquisicao>()
            .notRequired()
            .nullable(true)
            .oneOf(Object.values(EFormaDeAquisicao)),
        }),
    },
  },

  {
    chave: 'id_orgao_aquisicao',
    yup: {
      expression: Yup.number().when(['origem_aquisicao', 'forma_aquisicao'], {
        is: (origem_aquisicao, forma_aquisicao) =>
          forma_aquisicao === '1' && origem_aquisicao === '0',
        then: Yup.number()
          .required(requiredField('Orgao'))
          .typeError('Orgão de Aquisicao invalido'),
        otherwise: Yup.number()
          .notRequired()
          .nullable(true)
          .typeError('Orgão de Aquisicao invalido'),
      }),
    },
  },

  {
    chave: 'valor_aquisicao',
    yup: {
      expression: Yup.number()
        .when(['origem_aquisicao', 'forma_aquisicao'], {
          is: (origem_aquisicao, forma_aquisicao) =>
            origem_aquisicao === '0' && forma_aquisicao === '0',
          then: Yup.number()
            .required('Campo de Valor de Aquisicao é requerido')
            .typeError('Valor de aquisição invalido')
            .test(
              'NumeroInvalido',
              'Insira um valor de aquisicao valido',
              value =>
                !!(
                  value &&
                  value
                    .toString()
                    .match(/^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$/)
                ),
            ),
          otherwise: Yup.number()
            .notRequired()
            .typeError('Valor de aquisição invalido')
            .nullable(true),
        })
        .test('invalidValue', 'Valor de aquisição invalido', value => {
          try {
            if ((value && Number.parseFloat(value.toString())) || !value)
              return true;
            return false;
          } catch (error) {
            return false;
          }
        })
        .test(
          'bigValue',
          'Valor maior que R$ 99.000.000',
          value =>
            (value &&
              Number.parseFloat(value.toString()) <= maxValueAquisicao) ||
            !value,
        ),
    },
  },
];
