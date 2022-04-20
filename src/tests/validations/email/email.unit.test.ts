import 'reflect-metadata';
import { emailSchema } from '@modules/veiculos/schemas/schemaContext';
import { ValidationError } from 'yup';
import validationContext from '../../../contexts/validationContext';

describe('Unit test for email request', () => {
  test('should throw an error if invalid type of emails', async () => {
    try {
      await validationContext.validateData(emailSchema, {
        emails: 1,
      });

      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(TypeError);
    }
  });

  test('should validate if emails array is empty', async () => {
    try {
      await validationContext.validateData(emailSchema, {
        emails: [],
      });

      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.errors[0]).toBe('Array de emails é requerido');
    }
  });

  test('should validate if provided email is invalid type', async () => {
    try {
      await validationContext.validateData(emailSchema, {
        emails: [1],
      });

      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.errors[0]).toBe('Email invalido');
    }
  });
});
