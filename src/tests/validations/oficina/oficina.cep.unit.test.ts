import 'reflect-metadata';
import { oficinaSchema } from '@modules/veiculos/schemas/schemaContext';
import { ValidationError } from 'yup';
import validationContext from '../../../contexts/validationContext';

describe('unit test for validate oficina cep', () => {
  test('should throw an error if cep contains char', async () => {
    try {
      await validationContext.validateData(oficinaSchema, {
        cep: 'abcd',
      });
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.errors[0]).toBe('CEP deve conter apenas numeros');
    }
  });

  test('should throw an error if cep length not contains 10 chars', async () => {
    try {
      await validationContext.validateData(oficinaSchema, {
        cep: '1234',
      });
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.errors[0]).toBe('CEP deve ter 10 caracteres');
    }
  });

  test('should return a valid cep', async () => {
    const cep = {
      cep: '1234567890',
    };

    const response = await validationContext.validateData(oficinaSchema, cep);

    expect(response).toMatchObject(cep);
  });
});
