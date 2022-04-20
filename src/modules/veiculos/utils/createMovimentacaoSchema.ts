import * as Yup from 'yup';
import { requiredField } from './fieldsMessageValidation';

const tiposMovimentacoesFases = {
  oferta: 1,
  concessao: 2,
  recebimento: 3,
  recusa: 4,
  devolucao: 5,
  entrega: 6,
};

const createMovimentacaoSchema = Yup.object()
  .shape(
    {
      id_tipo_movimentacao: Yup.number().when('id_movimentacao', {
        is: id_movimentacao => !!id_movimentacao,
        then: Yup.number().notRequired(),
        otherwise: Yup.number().required('Tipo de movimentação é requerido'),
      }),
      id_tipo_movimentacao_fase: Yup.number()
        .required('Tipo de fase de movimentacao é requerido')
        .oneOf(Object.values(tiposMovimentacoesFases)),

      id_movimentacao: Yup.number()
        .notRequired()
        .when(['id_tipo_movimentacao', 'id_tipo_movimentacao_fase'], {
          is: (id_tipo_movimentacao, id_tipo_movimentacao_fase) =>
            !id_tipo_movimentacao && id_tipo_movimentacao_fase !== 1,
          then: Yup.number()
            .required(requiredField('Id Movimentacao'))
            .typeError('Ap'),
        }),

      justificativa: Yup.string().when('id_tipo_movimentacao_fase', {
        is: movimentacaoFase => movimentacaoFase === 4,
        then: Yup.string()
          .required('Justificativa é requerido')
          .typeError('Justificativa Invalido'),
      }),

      id_opm_origem: Yup.number().when(
        ['id_tipo_movimentacao', 'id_tipo_movimentacao_fase'],
        {
          is: (id_tipo_movimentacao, movimentacaoFase) =>
            (movimentacaoFase === 1 || movimentacaoFase === 2) &&
            !!id_tipo_movimentacao,
          then: Yup.number()
            .required('Numero da movimentacao é requerido')
            .typeError('Numero de movimentacao Invalido'),
          otherwise: Yup.number().notRequired(),
        },
      ),
      id_opm_destino: Yup.number().when(
        ['id_tipo_movimentacao', 'id_tipo_movimentacao_fase'],
        {
          is: (id_tipo_movimentacao, movimentacaoFase) =>
            (movimentacaoFase === 1 || movimentacaoFase === 2) &&
            !!id_tipo_movimentacao,
          then: Yup.number()
            .required('Numero da movimentacao é requerido')
            .typeError('Numero de movimentacao Invalido'),
          otherwise: Yup.number().notRequired(),
        },
      ),

      id_orgao: Yup.number().when(
        ['id_tipo_movimentacao', 'id_tipo_movimentacao_fase'],
        {
          is: (id_tipo_movimentacao, movimentacaoFase) =>
            movimentacaoFase === 3 && !!id_tipo_movimentacao,
          then: Yup.number()
            .required('Numero da movimentacao é requerido')
            .typeError('Numero de movimentacao Invalido'),
          otherwise: Yup.number().notRequired(),
        },
      ),

      observacao: Yup.string().notRequired(),
    },
    [['id_tipo_movimentacao', 'id_movimentacao']],
  )
  .required('Movimentacao é necessaria');

export default createMovimentacaoSchema;

export type CreateMovimentacaoSchema = Yup.InferType<
  typeof createMovimentacaoSchema
>;
