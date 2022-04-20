import 'reflect-metadata';
import { pneusSchema } from '@modules/veiculos/schemas/schemaContext';
import { ValidationError } from 'yup';
import validationContext from '../../../contexts/validationContext';

describe.skip('Unit test for referencias pneus', () => {
  test('should throw an error on invalid format of referencias_pneus', async () => {
    try {
      await validationContext.validateData(pneusSchema, {
        referencias_pneus: [],
      });

      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.errors[0]).toBe(
        'Lista de referencias de pneus é obrigatorio',
      );
    }
  });

  test('should throw an error on invalid item of referencias_pneus', async () => {
    try {
      await validationContext.validateData(pneusSchema, {
        referencias_pneus: [{}],
      });

      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.errors[0]).toBe('Campo de descrição é requerido');
    }
  });

  test('should return an valid item of referencias_pneus', async () => {
    const response = await validationContext.validateData(pneusSchema, {
      referencias_pneus: [{ descricao: 'teste' }],
    });

    expect(response).toMatchObject({
      referencias_pneus: [{ descricao: 'teste' }],
    });
  });
});
