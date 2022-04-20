import * as Yup from 'yup';
import { requiredField } from './fieldsMessageValidation';

const movimentacaoSchema = Yup.object({
  id_tipo_movimentacao: Yup.number()
    .required(requiredField('Id Tipo Movimentacao'))
    .typeError('Id Tipo de Movimentacao Invalido'),
  // .matches(/^[0-9]*$/, 'Somente numeros'),
  id_opm_origem: Yup.number()
    .required(requiredField('Opm de Origem'))
    .typeError('Opm Origem invalida'),
  // .matches(/^[0-9]*$/, 'Somente numeros'),
  id_opm_destino: Yup.number()
    .required(requiredField('Opm de Destino'))
    .typeError('Opm Destino invalida'),
  // .matches(/^[0-9]*$/, 'Somente numeros'),
  id_veiculo: Yup.string()
    .required(requiredField('Id do Veiculo'))
    .matches(/^[0-9]*$/, 'Somente numeros'),
})
  .notRequired()
  .typeError('Formato de movimentacao invalido');

export const schemaCreateDocumento = Yup.object()
  .shape({
    movimentacao: movimentacaoSchema,
  })
  .required(requiredField('Dados da movimentacao e Obrigatoria'));

export type SchemaCreateDocumento = Yup.InferType<typeof schemaCreateDocumento>;
