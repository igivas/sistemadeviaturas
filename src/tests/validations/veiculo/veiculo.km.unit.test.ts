import 'reflect-metadata';
import {
  veiculoSchema,
  aquisicaoSchema,
} from '@modules/veiculos/schemas/schemaContext';
import { EOrigemDeAquisicao } from '@modules/veiculos/enums/EAquisicao';
import { ValidationError } from 'yup';
import { requiredField } from '@modules/veiculos/schemas/messages/fieldsMessageValidation';
import context from '../../../contexts/validationContext';

describe.skip('Unit tests for veiculo post request', () => {
  test('should throw an error if km is negative', async () => {
    const schemaVeiculoAquisicao = context.concatSchema(
      veiculoSchema,
      aquisicaoSchema,
      'aquisicao',
    );

    const date = new Date();

    try {
      await context.validateData(schemaVeiculoAquisicao, {
        aquisicao: {
          origem_aquisicao: EOrigemDeAquisicao.LOCADO,
          data_aquisicao: date,
        },
        km: -1,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.errors[0]).toEqual('O km não pode ser negativo');
      expect(error.value).toMatchObject({
        aquisicao: {
          origem_aquisicao: EOrigemDeAquisicao.LOCADO,
          data_aquisicao: date,
        },
      });
    }
  });

  test('should throw an error when km is required', async () => {
    const schemaVeiculoAquisicao = context.concatSchema(
      veiculoSchema,
      aquisicaoSchema,
      'aquisicao',
    );

    const date = new Date();

    try {
      await context.validateData(schemaVeiculoAquisicao, {
        aquisicao: {
          origem_aquisicao: EOrigemDeAquisicao.CESSAO,
          data_aquisicao: date,
          id_orgao_aquisicao: 1,
        },
      });
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.errors[0]).toEqual(requiredField('KM'));
      expect(error.value).toMatchObject({
        aquisicao: {
          origem_aquisicao: EOrigemDeAquisicao.CESSAO,
          data_aquisicao: date,
          id_orgao_aquisicao: 1,
        },
      });
    }
  });

  test('should return an object containing KM if object is valid', async () => {
    const schemaVeiculoAquisicao = context.concatSchema(
      veiculoSchema,
      aquisicaoSchema,
      'aquisicao',
    );

    const date = new Date();

    const response = await context.validateData(schemaVeiculoAquisicao, {
      aquisicao: {
        origem_aquisicao: EOrigemDeAquisicao.CESSAO,
        data_aquisicao: date,
        id_orgao_aquisicao: 1,
      },
      km: 3,
    });
    expect(response).toMatchObject({ km: 3 });
  });
});
