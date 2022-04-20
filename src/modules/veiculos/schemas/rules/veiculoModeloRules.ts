/* eslint-disable import/prefer-default-export */
import { IValidationRules } from '@modules/veiculos/interfaces/validation/IValidationRules';
import * as Yup from 'yup';

export const createVeiculoModeloRules: IValidationRules = [
  {
    chave: 'nome',
    yup: {
      expression: Yup.string().required('Nome do modelo é requerido'),
    },
  },

  {
    chave: 'id_veiculo_especie',
    yup: {
      expression: Yup.number()
        .required('Campo Veículo Espécie é requerido')
        .typeError('Campo Veículo Espécie deve ser um número'),
    },
  },

  {
    chave: 'id_veiculo_marca',
    yup: {
      expression: Yup.number()
        .required('Campo Marca é requerido')
        .typeError('Campo Marca deve ser um número'),
    },
  },
];
