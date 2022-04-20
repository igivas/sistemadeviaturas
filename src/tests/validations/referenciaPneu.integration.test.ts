import 'reflect-metadata';
import { pneusSchema } from '@modules/veiculos/schemas/schemaContext';
import { ValidationError } from 'yup';
import validationContext from '../../contexts/validationContext';

describe('Integration test suite for validate referencia pneu rules', () => {
  test('should throw an error on invalid type of id_veiculo_especie', async () => {
    try {
      await validationContext.validateData(pneusSchema, {
        referencias_pneus: [
          {
            id_veiculo_especie: '-1',
            descricao: 'desc',
          },
        ],
      });

      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.errors[0]).toBe('Apenas números positivos');
    }
  });

  test('should throw an error on invalid type of descricao', async () => {
    try {
      await validationContext.validateData(pneusSchema, {
        referencias_pneus: [
          {
            id_veiculo_especie: 1,
            descricao: '',
          },
        ],
      });

      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.errors[0]).toBe('Campo de descrição é requerido');
    }
  });

  test('should return an object on valida referencias_pneus', async () => {
    const response = await validationContext.validateData(pneusSchema, {
      referencias_pneus: [
        {
          id_veiculo_especie: 1,
          descricao: 'descricao1',
        },
      ],
    });

    expect(response).toMatchObject({
      referencias_pneus: [
        {
          id_veiculo_especie: 1,
          descricao: 'descricao1',
        },
      ],
    });
  });
});
