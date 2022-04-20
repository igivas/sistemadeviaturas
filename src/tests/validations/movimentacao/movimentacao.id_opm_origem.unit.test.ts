import 'reflect-metadata';
import { createMovimentacaoRules } from '@modules/veiculos/schemas/rules/movimentacaoRules';
import { ValidationError } from 'yup';
import validationContext from '../../../contexts/validationContext';

describe('Unit test suite for validate movimentacao rules', () => {
  test('should throw an error if id_opm_origem is invalid', async () => {
    const movimentacaoSchema = validationContext.createSchema(
      createMovimentacaoRules,
    );

    try {
      await movimentacaoSchema.validate({
        id_opm_origem: 'oferta',
      });
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.value).toMatchObject({
        id_opm_origem: Number.NaN,
      });
      expect(error.message).toBe('Tipo invalido de id_opm_origem');
    }
  });

  test('should return an object if id_opm_origem is valid type', async () => {
    const movimentacaoSchema = validationContext.createSchema(
      createMovimentacaoRules,
    );

    const validation = await movimentacaoSchema.validate({
      id_opm_origem: 1,
    });

    expect(validation).toMatchObject({
      id_opm_origem: 1,
    });
  });
});
