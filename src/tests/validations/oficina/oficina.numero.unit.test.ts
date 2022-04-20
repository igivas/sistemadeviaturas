import 'reflect-metadata';
import { oficinaSchema } from '@modules/veiculos/schemas/schemaContext';
import { ValidationError } from 'yup';
import validationContext from '../../../contexts/validationContext';

describe('unit test for validate oficina numero do endereco', () => {
  test('should throw an error if numero do endereco is not set', async () => {
    try {
      await validationContext.validateData(oficinaSchema, {});
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.errors[0]).toBe('Numero do endereco é requerido');
    }
  });

  test('should throw an error if numero do endereco length contains more than 6 chars', async () => {
    try {
      await validationContext.validateData(oficinaSchema, {
        numero: '1234567',
      });
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.errors[0]).toBe(
        'Numero do endereco deve ter no maximo caracteres',
      );
    }
  });

  test('should return a valid numero do endereco', async () => {
    const numero = {
      numero: '123456',
    };

    const response = await validationContext.validateData(
      oficinaSchema,
      numero,
    );

    expect(response).toMatchObject(numero);
  });
});
