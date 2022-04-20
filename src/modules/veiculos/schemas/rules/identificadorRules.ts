import { isDate } from 'date-fns';
import * as Yup from 'yup';
import {
  dateTypeErrorField,
  requiredField,
} from '../messages/fieldsMessageValidation';
import { IValidationRules } from '../../interfaces/validation/IValidationRules';

// eslint-disable-next-line import/prefer-default-export
export const createIdentificadorRules: IValidationRules = [
  {
    chave: 'data_identificador',
    yup: {
      expression: Yup.date()
        .typeError(dateTypeErrorField('Data Identificador'))
        .required(requiredField('Data Identificador'))
        .test('isValidDate', 'Data Identificador invalida', value =>
          isDate(value),
        ),
    },
  },

  {
    chave: 'identificador',
    yup: {
      expression: Yup.string()
        .uppercase('Identificador deve ser em letra maiúscula')
        .required(requiredField('Identificador'))
        .trim(),
    },
  },
];
