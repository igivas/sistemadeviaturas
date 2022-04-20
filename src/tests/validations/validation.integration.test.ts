import 'reflect-metadata';
import { createAquisicaoRules } from '@modules/veiculos/schemas/rules/aquisicaoRules';
import { EOrigemDeAquisicao } from '@modules/veiculos/enums/EAquisicao';
import YupValidation from '../../patterns/strategy/schemas/Yup';
import validationContext from '../../contexts/validationContext';

describe('Unit test for veiculo post request', () => {
  test('Context should be instance of YupValidation ', () => {
    expect(validationContext.getStrategy()).toBeInstanceOf(YupValidation);
  });

  test('should not contain existent field on return', async () => {
    const schema = validationContext.createSchema(createAquisicaoRules);

    const data_aquisicao = new Date();
    const result = await validationContext.validateData(schema, {
      origem_aquisicao: EOrigemDeAquisicao.LOCADO,
      data_aquisicao,
      nonExistentField: 123,
    });

    expect(result).toEqual({
      origem_aquisicao: EOrigemDeAquisicao.LOCADO,
      data_aquisicao,
    });
  });
});
