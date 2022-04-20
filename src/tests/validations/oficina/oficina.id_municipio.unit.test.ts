import 'reflect-metadata';
import { oficinaSchema } from '@modules/veiculos/schemas/schemaContext';
import { ValidationError } from 'yup';
import validationContext from '../../../contexts/validationContext';

describe('unit test for validate oficina id_municipio', () => {
  test('should throw an error if id_municipio is not set', async () => {
    try {
      await validationContext.validateData(oficinaSchema, {});
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.errors[0]).toBe('Municipio é requerido');
    }
  });

  test('should throw an error if id_municipio contains char', async () => {
    try {
      await validationContext.validateData(oficinaSchema, {
        id_municipio: 'abcd',
      });
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.errors[0]).toBe('Municipio deve conter apenas numeros');
    }
  });

  test('should throw an error if id_municipio length not contains 6 chars', async () => {
    try {
      await validationContext.validateData(oficinaSchema, {
        id_municipio: '1234',
      });
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.errors[0]).toBe('Municipio deve ter 6 caracteres');
    }
  });

  test('should return a valid id_municipio', async () => {
    const id_municipio = {
      id_municipio: '123456',
    };

    const response = await validationContext.validateData(
      oficinaSchema,
      id_municipio,
    );

    expect(response).toMatchObject(id_municipio);
  });
});
