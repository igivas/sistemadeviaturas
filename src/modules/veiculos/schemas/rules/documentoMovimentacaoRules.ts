import { IValidationRules } from '@modules/veiculos/interfaces/validation/IValidationRules';
import * as Yup from 'yup';
import { requiredField } from '@modules/veiculos/utils/fieldsMessageValidation';

// eslint-disable-next-line import/prefer-default-export
export const createDocumentoMovimentacaoRules: IValidationRules = [
  {
    chave: 'id_tipo_movimentacao',
    yup: {
      expression: Yup.number()
        .required(requiredField('Id Tipo Movimentacao'))
        .typeError('Id Tipo de Movimentacao Invalido'),
    },
  },

  {
    chave: 'id_opm_origem',
    yup: {
      expression: Yup.number()
        .required(requiredField('Opm de Origem'))
        .typeError('Opm Origem invalida'),
    },
  },

  {
    chave: 'id_opm_destino',
    yup: {
      expression: Yup.number()
        .required(requiredField('Opm de Destino'))
        .typeError('Opm Destino invalida'),
    },
  },

  {
    chave: 'id_veiculo',
    yup: {
      expression: Yup.string()
        .required(requiredField('Id do Veiculo'))
        .matches(/^[0-9]*$/, 'Somente numeros'),
    },
  },
];
