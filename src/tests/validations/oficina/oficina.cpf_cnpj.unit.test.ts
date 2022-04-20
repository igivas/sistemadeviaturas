import 'reflect-metadata';
import { oficinaSchema } from '@modules/veiculos/schemas/schemaContext';
import { ValidationError } from 'yup';
import validationContext from '../../../contexts/validationContext';

describe('unit test for validate oficina cpf_cnpj', () => {
  test('should throw an error if cpf_cnpj is not set', async () => {
    try {
      await validationContext.validateData(oficinaSchema, {});
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.errors[0]).toBe('CPF/CNPJ é requerido');
    }
  });

  test('should throw an error if cpf_cnpj contains char', async () => {
    try {
      await validationContext.validateData(oficinaSchema, {
        cpf_cnpj: 'abcd',
      });
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.errors[0]).toBe('CPF/CNPJ deve conter apenas numeros');
    }
  });

  test('should throw an error if cpf_cnpj lenght less than 11 chars', async () => {
    try {
      await validationContext.validateData(oficinaSchema, {
        cpf_cnpj: '1234',
      });
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.errors[0]).toBe('CPF deve ter 11 caracteres');
    }
  });

  test('should throw an error if cpf_cnpj lenght less than 14 chars', async () => {
    try {
      await validationContext.validateData(oficinaSchema, {
        cpf_cnpj: '020342823451',
      });
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.errors[0]).toBe('CNPJ deve ter 14 caracteres');
    }
  });

  test('should return a valid cpf_cnpj', async () => {
    const cpfCnpj = {
      cpf_cnpj: '02034282345',
    };

    const response = await validationContext.validateData(
      oficinaSchema,
      cpfCnpj,
    );

    expect(response).toMatchObject(cpfCnpj);
  });
});
