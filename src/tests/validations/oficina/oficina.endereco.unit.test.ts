import 'reflect-metadata';
import { oficinaSchema } from '@modules/veiculos/schemas/schemaContext';
import { ValidationError } from 'yup';
import validationContext from '../../../contexts/validationContext';

describe('unit test for validate oficina endereco', () => {
  test('should throw an error if endereco is not set', async () => {
    try {
      await validationContext.validateData(oficinaSchema, {});
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.errors[0]).toBe('Endereco é requerido');
    }
  });

  test('should throw an error if endereco length contains more than 80 chars', async () => {
    try {
      await validationContext.validateData(oficinaSchema, {
        endereco:
          '4z3yfrNTn6u0GnsGhGlUMUyxFJibyiLc2p3gvC3JdzZDZmaUsw7QLsy1xdmXWKqwiUYwcxwmBVy1CuycJ',
      });
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.errors[0]).toBe('Endereco deve ter no maximo 80 caracteres');
    }
  });

  test('should return a valid endereco', async () => {
    const endereco = {
      endereco: '123456',
    };

    const response = await validationContext.validateData(
      oficinaSchema,
      endereco,
    );

    expect(response).toMatchObject(endereco);
  });
});
