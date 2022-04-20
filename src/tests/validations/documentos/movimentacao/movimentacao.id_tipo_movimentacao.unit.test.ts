import { createDocumentoMovimentacaoRules } from '@modules/veiculos/schemas/rules/documentoMovimentacaoRules';
import { ValidationError } from 'yup';
import 'reflect-metadata';
import { requiredField } from '@modules/veiculos/schemas/messages/fieldsMessageValidation';
import validationContext from '../../../../contexts/validationContext';

describe.skip('Unit test for validate id_tipo_movimentacao from documentoMovimentacaoRUles', () => {
  test('should throw an error if id_tipo_movimentacao is incorrect type', async () => {
    const schemaDocumentoMovimentacao = validationContext.createSchema(
      createDocumentoMovimentacaoRules,
    );

    try {
      await validationContext.validateData(schemaDocumentoMovimentacao, {
        id_tipo_movimentacao: 'abc',
      });
    } catch (error) {
      expect(error).toBeInstanceOf(TypeError);
    }
  });

  test('should throw an error if id_tipo_movimentacao is not required', async () => {
    const schemaDocumentoMovimentacao = validationContext.createSchema(
      createDocumentoMovimentacaoRules,
    );

    try {
      await validationContext.validateData(schemaDocumentoMovimentacao, {});
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.value).toEqual({});
      expect(error.errors[0]).toBe(requiredField('Id Tipo Movimentacao'));
    }
  });

  test('should return an object on validated id_tipo_movimentacao', async () => {
    const schemaDocumentoMovimentacao = validationContext.createSchema(
      createDocumentoMovimentacaoRules,
    );

    const result = await validationContext.validateData(
      schemaDocumentoMovimentacao,
      {
        id_tipo_movimentacao: 1,
      },
    );
    expect(result).toMatchObject({
      id_tipo_movimentacao: 1,
    });
  });
});
