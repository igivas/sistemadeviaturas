import * as Yup from 'yup';
import { IValidationRules } from '../../interfaces/validation/IValidationRules';

// eslint-disable-next-line import/prefer-default-export
export const createReferenciasPneusRules: IValidationRules = [
  {
    chave: 'referencias_pneus',
    yup: {
      arrayExpression: Yup.array()
        .of(
          Yup.object({
            id_veiculo_especie: Yup.number()
              .required('Id do veiculo espécie é requerido')
              .typeError('Formato inválido veiculo espécie')
              .positive('Apenas números positivos'),
            descricao: Yup.string().required('Campo de descrição é requerido'),
          }).required('Dados da referencia de pneu é requerido'),
        )
        .required('Lista de referencias de pneus é obrigatorio'),
    },
  },
];
