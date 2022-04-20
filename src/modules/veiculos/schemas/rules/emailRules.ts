import { IValidationRules } from '@modules/veiculos/interfaces/validation/IValidationRules';
import * as Yup from 'yup';

// eslint-disable-next-line import/prefer-default-export
export const createEmailRules: IValidationRules = [
  {
    chave: 'emails',
    yup: {
      arrayExpression: Yup.array()
        .of(
          Yup.string()
            .email('Email invalido')
            .required('Campo Email é requerido'),
        )
        .required('Array de emails é requerido')
        .typeError('Formato invalido de emails'),
    },
  },
];
