import * as Yup from 'yup';
import { EPrefixoTipo, EEmprego } from '@modules/veiculos/enums/EPrefixo';
import prefixoMapper from '@modules/veiculos/mappers/prefixo';
import { requiredField } from '../messages/fieldsMessageValidation';
import { IValidationRules } from '../../interfaces/validation/IValidationRules';

// eslint-disable-next-line import/prefer-default-export
export const createPrefixoRules: IValidationRules = [
  {
    chave: 'prefixo_tipo',
    yup: {
      expression: Yup.mixed<EPrefixoTipo>()
        .oneOf(Object.values(EPrefixoTipo), 'Prefixo tipo invalido')
        .required(requiredField('Prefixo Tipo'))
        .transform((prefixoTipo: string) => prefixoTipo.trim()),
    },
  },

  {
    chave: 'prefixo_sequencia',
    yup: {
      expression: Yup.string()
        .required(requiredField('Prefixo Sequencia'))
        .transform((prefixoSequencia: string) =>
          prefixoSequencia.trimRight().trimLeft(),
        ),
    },
  },

  {
    chave: 'emprego',
    yup: {
      expression: Yup.mixed<EEmprego>()
        .required(requiredField('Emprego'))
        .oneOf(Object.values(EEmprego), 'Tipo de emprego invalido')
        .transform((emprego: string) => emprego.trim())
        .test(
          'isIncorrectPrefixoTipo',
          'Emprego e Prefixo Tipo enviados nao se relacionam',
          function (value: any) {
            const { prefixo_tipo } = this.parent;
            return prefixoMapper[prefixo_tipo as EPrefixoTipo].includes(value);
          },
        ),
    },
  },
];
