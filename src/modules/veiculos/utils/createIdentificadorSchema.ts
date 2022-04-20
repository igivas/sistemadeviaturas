import * as Yup from 'yup';
import { isDate } from 'date-fns';
import { requiredField, dateTypeErrorField } from './fieldsMessageValidation';

export const createIdentificadorSchema = Yup.object({
  data_identificador: Yup.date()
    .typeError(dateTypeErrorField('Data Identificador'))
    .required(requiredField('Data Identificador'))
    .test('isValidDate', 'Data Identificador invalida', value => isDate(value)),
  identificador: Yup.string().required(requiredField('Identificador')),
  observacao: Yup.string().notRequired(),
}).required(requiredField('Objeto Identificador'));

export type CreateIdentificadorSchema = Yup.InferType<
  typeof createIdentificadorSchema
>;
