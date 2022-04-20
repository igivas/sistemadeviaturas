import { createDocumentoMovimentacaoRules } from '@modules/veiculos/schemas/rules/documentoMovimentacaoRules';
import { ValidationError } from 'yup';
import 'reflect-metadata';
import { requiredField } from '@modules/veiculos/schemas/messages/fieldsMessageValidation';
import validationContext from '../../../../contexts/validationContext';

describe.skip('Unit test for validate id_opm_origem from documentoMovimentacaoRUles', () => {
  test('should throw an error if id_opm_origem is incorrect type', async () => {
    const schemaDocumentoMovimentacao = validationContext.createSchema(
      createDocumentoMovimentacaoRules,
    );

    try {
      await validationContext.validateData(schemaDocumentoMovimentacao, {
        id_opm_origem: 'abc',
      });
    } catch (error) {
      expect(error).toBeInstanceOf(TypeError);
    }
  });

  test('should throw an error if id_opm_origem is not required', async () => {
    const schemaDocumentoMovimentacao = validationContext.createSchema(
      createDocumentoMovimentacaoRules,
    );

    try {
      await validationContext.validateData(schemaDocumentoMovimentacao, {});
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.value).toEqual({});
      expect(error.errors[0]).toBe(requiredField('Opm de Origem'));
    }
  });

  test('should return an object on validated id_opm_origem', async () => {
    const schemaDocumentoMovimentacao = validationContext.createSchema(
      createDocumentoMovimentacaoRules,
    );

    const result = await validationContext.validateData(
      schemaDocumentoMovimentacao,
      {
        id_opm_origem: 1,
      },
    );
    expect(result).toMatchObject({
      id_opm_origem: 1,
    });
  });
});
