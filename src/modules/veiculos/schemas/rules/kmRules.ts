import { IValidationRules } from '@modules/veiculos/interfaces/validation/IValidationRules';
import * as Yup from 'yup';
import { requiredField } from '../messages/fieldsMessageValidation';

// eslint-disable-next-line import/prefer-default-export
export const createKmRules: IValidationRules = [
  {
    chave: 'data_km',
    yup: {
      expression: Yup.date()
        .required(requiredField('Data Situacao é requerida'))
        .typeError('Data em formato invalido'),
    },
  },

  {
    chave: 'km_atual',
    yup: {
      expression: Yup.number()
        .required(requiredField('Km'))
        .typeError('Apenas formato numérico')
        .min(0, 'O valor minimo é zero'),
    },
  },

  {
    chave: 'observacao',
    yup: {
      expression: Yup.string()
        .notRequired()
        .nullable(true)
        .typeError('Tipo invalido de observacao'),
    },
  },
];
