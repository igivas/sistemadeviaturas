import { IValidationRules } from '@modules/veiculos/interfaces/validation/IValidationRules';
import * as Yup from 'yup';

// eslint-disable-next-line import/prefer-default-export
export const createOficinaRules: IValidationRules = [
  {
    chave: 'nome',
    yup: {
      expression: Yup.string().required('Nome da oficina é requerido'),
    },
  },

  {
    chave: 'id_oficina_pai',
    yup: {
      expression: Yup.string()
        .notRequired()
        .max(65, 'Oficina matriz matriz deve ser no maximo 65 caracteres'),
    },
  },

  {
    chave: 'cpf_cnpj',
    yup: {
      expression: Yup.string()
        .required('CPF/CNPJ é requerido')
        .matches(/^[0-9]*$/, 'CPF/CNPJ deve conter apenas numeros')
        .test(
          'isCPF',
          'CPF deve ter 11 caracteres',
          value => !(!value || (value.length < 11 && value.length !== 11)),
        )
        .test(
          'isCNPJ',
          'CNPJ deve ter 14 caracteres',
          value =>
            !(
              !value ||
              (value.length !== 11 && value.length < 14 && value.length !== 14)
            ),
        ),
    },
  },

  {
    chave: 'id_municipio',
    yup: {
      expression: Yup.string()
        .required('Municipio é requerido')
        .matches(/^[0-9]*$/, 'Municipio deve conter apenas numeros')
        .length(6, 'Municipio deve ter 6 caracteres'),
    },
  },

  {
    chave: 'cep',
    yup: {
      expression: Yup.string()
        .notRequired()
        .matches(/^[0-9]*$/, 'CEP deve conter apenas numeros')
        .length(8, 'CEP deve ter 10 caracteres'),
    },
  },

  {
    chave: 'endereco',
    yup: {
      expression: Yup.string()
        .required('Endereco é requerido')
        .max(80, 'Endereco deve ter no maximo 80 caracteres'),
    },
  },

  {
    chave: 'numero',
    yup: {
      expression: Yup.string()
        .required('Numero do endereco é requerido')
        .max(6, 'Numero do endereco deve ter no maximo caracteres'),
    },
  },

  {
    chave: 'endereco_complemento',
    yup: {
      expression: Yup.string()
        .notRequired()
        .max(60, 'Endereco complemento deve ter no máximo 60 caracteres'),
    },
  },
];
