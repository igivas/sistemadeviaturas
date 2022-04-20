import 'reflect-metadata';
import { pneusSchema } from '@modules/veiculos/schemas/schemaContext';
import { ValidationError } from 'yup';
import validationContext from '../../../contexts/validationContext';

describe('unit test validation rule for referencia pneu', () => {
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
      expect(error.errors[0]).toBe('Id do veiculo espécie é requerido');
    }
  });

  test('should return an valid item of referencias_pneus', async () => {
    const response = await validationContext.validateData(pneusSchema, {
      referencias_pneus: [{ id_veiculo_especie: 1 }],
    });

    expect(response).toMatchObject({
      referencias_pneus: [{ id_veiculo_especie: 1 }],
    });
  });
});
