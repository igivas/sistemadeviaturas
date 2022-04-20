import 'reflect-metadata';
import { createMovimentacaoRules } from '@modules/veiculos/schemas/rules/movimentacaoRules';
import { ValidationError } from 'yup';
import ETipoMovimentacaoFase from '@modules/veiculos/enums/ETipoMovimentacaoFase';
import validationContext from '../../../contexts/validationContext';

describe('Unit test suite for validate movimentacao rules', () => {
  test('should throw an error if id_tipo_movimentacao_fase is invalid', async () => {
    const movimentacaoSchema = validationContext.createSchema(
      createMovimentacaoRules,
    );

    try {
      await movimentacaoSchema.validate({
        id_tipo_movimentacao_fase: 'oferta',
      });
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.value).toMatchObject({
        id_tipo_movimentacao_fase: Number.NaN,
      });
      expect(error.message).toBe('Fase de movimentacao invalida');
    }
  });

  test('should throw an error if id_tipo_movimentacao_fase is not required', async () => {
    const movimentacaoSchema = validationContext.createSchema(
      createMovimentacaoRules,
    );
    try {
      await movimentacaoSchema.validate({});
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.value).toMatchObject({});
      expect(error.message).toBe('Tipo de fase de movimentacao é requerido');
    }
  });

  test('should return an object if id_tipo_movimentacao_Fase is valid type', async () => {
    const movimentacaoSchema = validationContext.createSchema(
      createMovimentacaoRules,
    );

    const validation = await movimentacaoSchema.validate({
      id_tipo_movimentacao_fase: ETipoMovimentacaoFase.oferta,
    });

    expect(validation).toMatchObject({
      id_tipo_movimentacao_fase: ETipoMovimentacaoFase.oferta,
    });
  });
});
