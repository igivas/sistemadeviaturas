import 'reflect-metadata';
import { oficinaSchema } from '@modules/veiculos/schemas/schemaContext';
import { ValidationError } from 'yup';
import validationContext from '../../../contexts/validationContext';

describe('unit test for validate oficina endereco_complemento', () => {
  test('should throw an error if endereco_complemento length contains more than 60 chars', async () => {
    try {
      await validationContext.validateData(oficinaSchema, {
        endereco_complemento:
          '4z3yfrNTn6u0GnsGhGlUMUyxFJibyiLc2p3gvC3JdzZDZmaUsw7QLsy1xdmXWKqwiUYwcxwmBVy1CuycJ',
      });
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.errors[0]).toBe(
        'Endereco complemento deve ter no máximo 60 caracteres',
      );
    }
  });

  test('should return a valid endereco_complemento', async () => {
    const endereco_complemento = {
      endereco_complemento: '1234567890',
    };

    const response = await validationContext.validateData(
      oficinaSchema,
      endereco_complemento,
    );

    expect(response).toMatchObject(endereco_complemento);
  });
});
