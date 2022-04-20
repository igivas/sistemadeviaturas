import 'reflect-metadata';
import { oficinaSchema } from '@modules/veiculos/schemas/schemaContext';
import validationContext from '../../../contexts/validationContext';

describe('unit test for validate nome oficina', () => {
  test('should throw an error if nome is not set', async () => {
    try {
      await validationContext.validateData(oficinaSchema, {});
      expect(true).toBe(false);
    } catch (error) {
      expect(error.errors[0]).toBe('Nome da oficina é requerido');
    }
  });

  test('should return an valid oficina nome ', async () => {
    const oficinaNome = {
      nome: 'Oficina 01',
    };

    const response = await validationContext.validateData(
      oficinaSchema,
      oficinaNome,
    );

    expect(response).toMatchObject(oficinaNome);
  });
});
