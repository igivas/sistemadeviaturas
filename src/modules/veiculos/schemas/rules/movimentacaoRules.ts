import { IValidationRules } from '@modules/veiculos/interfaces/validation/IValidationRules';
import * as Yup from 'yup';
import ETipoMovimentacao from '@modules/veiculos/enums/ETipoMovimentacao';
import EFase from '@modules/veiculos/enums/EFase';
import ETipoAssinatura from '@modules/veiculos/enums/ETipoAssinatura';

const defaultMovimentacaoRules: IValidationRules = [
  {
    chave: 'id_tipo_movimentacao',
    yup: {
      expression: Yup.number()
        .oneOf(
          Object.values(ETipoMovimentacao).filter(
            tipoMovimentacao => typeof tipoMovimentacao !== 'string',
          ) as (ETipoMovimentacao | Yup.Ref)[],
        )
        .notRequired()
        .nullable(true)
        .typeError('Tipo de movimentacao invalido'),
    },
  },

  {
    chave: 'id_tipo_movimentacao_fase',
    yup: {
      expression: Yup.number()
        .required('Tipo de fase de movimentacao é requerido')
        .oneOf(
          Object.values(EFase).filter(fase => typeof fase !== 'string') as (
            | EFase
            | Yup.Ref
          )[],
        )
        .typeError('Fase de movimentacao invalida'),
    },
  },

  {
    chave: 'id_movimentacao',
    yup: {
      expression: Yup.number()
        .notRequired()
        .nullable(true)
        .typeError('Tipo invalido de id_movimentacao'),
    },
  },

  {
    chave: 'data_movimentacao',
    yup: { expression: Yup.date().typeError('Data da movimentacao invalida') },
  },

  {
    chave: 'id_opm_origem',
    yup: {
      expression: Yup.number()
        .notRequired()
        .nullable(true)
        .typeError('Tipo invalido de id_opm_origem'),
    },
  },

  {
    chave: 'assinatura',
    yup: {
      expression: Yup.string()
        .notRequired()
        .nullable(true)
        .typeError('Tipo invalido de assinatura'),
    },
  },

  {
    chave: 'pin',
    yup: {
      expression: Yup.string()
        .notRequired()
        .nullable(true)
        .typeError('Tipo invalido de pin'),
    },
  },

  {
    chave: 'tipo_assinatura',
    yup: {
      expression: Yup.mixed<ETipoAssinatura>()
        .oneOf(Object.values(ETipoAssinatura))
        .notRequired()
        .nullable(true)
        .typeError('Tipo invalido de pin'),
    },
  },

  {
    chave: 'cpf',
    yup: {
      expression: Yup.string()
        .notRequired()
        .nullable(true)
        .typeError('Tipo invalido de cpf'),
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

  {
    chave: 'opms',
    yup: {
      arrayExpression: Yup.array()
        .of(
          Yup.number()
            .required('Id Opm é requerido')
            .typeError('Apenas Formato Numerico'),
        )
        .required('Opms para validar movimentacao é necessario')
        .min(1, 'No minimo uma opm'),
    },
  },
];

// eslint-disable-next-line import/prefer-default-export
export const createMovimentacaoRules: IValidationRules = [
  ...defaultMovimentacaoRules,
  {
    chave: 'id_opm_destino',
    yup: {
      expression: Yup.number()
        .notRequired()
        .nullable(true)
        .typeError('Tipo invalido de id_opm_origem'),
    },
  },

  {
    chave: 'identificador',
    yup: {
      expression: Yup.string()
        .uppercase('Identificador deve ser em letra maiúscula')
        .notRequired()
        .trim(),
    },
  },
];

export const createMovimentacaoEmprestimoRules: IValidationRules = [
  ...defaultMovimentacaoRules,
  {
    chave: 'data_retorno',
    yup: {
      expression: Yup.date().typeError('Data de retorno invalida'),
    },
  },
];

export const createMovimentacaoManutencaoRules: IValidationRules = [
  ...defaultMovimentacaoRules,
  {
    chave: 'km',
    yup: {
      expression: Yup.number().typeError('Formato de km inválido'),
    },
  },
  {
    chave: 'is_localizacao_patio',
    yup: {
      expression: Yup.boolean().typeError(
        'Valor invalido para localizacao no patio',
      ),
    },
  },
];
