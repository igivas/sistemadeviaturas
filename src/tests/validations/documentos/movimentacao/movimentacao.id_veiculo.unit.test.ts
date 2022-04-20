import { createDocumentoMovimentacaoRules } from '@modules/veiculos/schemas/rules/documentoMovimentacaoRules';
import { ValidationError } from 'yup';
import 'reflect-metadata';
import { requiredField } from '@modules/veiculos/schemas/messages/fieldsMessageValidation';
import validationContext from '../../../../contexts/validationContext';

describe('Unit test for validate id_veiculo from documentoMovimentacaoRUles', () => {
  test('should throw an error if id_veiculo is incorrect type', async () => {
    const schemaDocumentoMovimentacao = validationContext.createSchema(
      createDocumentoMovimentacaoRules,
    );

    try {
      await validationContext.validateData(schemaDocumentoMovimentacao, {
        id_veiculo: 1,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(TypeError);
    }
  });

  test('should throw an error if id_veiculo is not required', async () => {
    const schemaDocumentoMovimentacao = validationContext.createSchema(
      createDocumentoMovimentacaoRules,
    );

    try {
      await validationContext.validateData(schemaDocumentoMovimentacao, {});
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.value).toEqual({});
      expect(error.errors[0]).toBe(requiredField('Id do Veiculo'));
    }
  });

  test('should return an object on validated id_veiculo', async () => {
    const schemaDocumentoMovimentacao = validationContext.createSchema(
      createDocumentoMovimentacaoRules,
    );

    const result = await validationContext.validateData(
      schemaDocumentoMovimentacao,
      {
        id_veiculo: '1',
      },
    );
    expect(result).toMatchObject({
      id_veiculo: '1',
    });
  });
});
