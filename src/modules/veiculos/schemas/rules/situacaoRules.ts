import * as Yup from 'yup';
import { IValidationRules } from '@modules/veiculos/interfaces/validation/IValidationRules';
import { requiredField } from '../messages/fieldsMessageValidation';

// eslint-disable-next-line import/prefer-default-export
export const createSituacaoRules: IValidationRules = [
  {
    chave: 'id_situacao_tipo',
    yup: {
      expression: Yup.number()
        .required(requiredField('Tipo de situacao'))
        .typeError('Formato inválido de tipo de situacao'),
    },
  },

  {
    chave: 'id_situacao_tipo_especificacao',
    yup: {
      expression: Yup.number().required(requiredField('Tipo de situacao')),
    },
  },

  {
    chave: 'localizacao',
    yup: {
      expression: Yup.string().required(requiredField('Localizacao')),
    },
  },

  {
    chave: 'km',
    yup: {
      expression: Yup.number()
        .required(requiredField('Km'))
        .typeError('Apenas formato numérico')
        .min(0, 'O valor minimo é zero'),
    },
  },
  {
    chave: 'data_situacao',
    yup: {
      expression: Yup.date()
        .required(requiredField('Data Situacao é requerida'))
        .typeError('Data em formato invalido'),
    },
  },
];
