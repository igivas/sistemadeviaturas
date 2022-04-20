import 'reflect-metadata';
import { createMovimentacaoRules } from '@modules/veiculos/schemas/rules/movimentacaoRules';
import { ValidationError } from 'yup';
import ETipoMovimentacao from '@modules/veiculos/enums/ETipoMovimentacao';
import validationContext from '../../../contexts/validationContext';

describe('Unit test suite for validate movimentacao rules', () => {
  test('should throw an error if id_tipo_movimentacao is invalid', async () => {
    const movimentacaoSchema = validationContext.createSchema(
      createMovimentacaoRules,
    );

    try {
      await movimentacaoSchema.validate({
        id_tipo_movimentacao: 'oferta',
      });
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.value).toMatchObject({
        id_tipo_movimentacao: Number.NaN,
      });
      expect(error.message).toBe('Tipo de movimentacao invalido');
    }
  });

  test('should return an object if id_tipo_movimentacao is valid type', async () => {
    const movimentacaoSchema = validationContext.createSchema(
      createMovimentacaoRules,
    );

    const validation = await movimentacaoSchema.validate({
      id_tipo_movimentacao: ETipoMovimentacao.TRANSFERENCIA,
    });

    expect(validation).toMatchObject({
      id_tipo_movimentacao: ETipoMovimentacao.TRANSFERENCIA,
    });
  });
});
