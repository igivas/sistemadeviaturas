import 'reflect-metadata';
import { container } from 'tsyringe';
import { createVeiculoRules } from '@modules/veiculos/schemas/rules/veiculoRules';
import { createAquisicaoRules } from '@modules/veiculos/schemas/rules/aquisicaoRules';
import { IValidationRules } from '@modules/veiculos/interfaces/validation/IValidationRules';
import { IPostVeiculos } from '@modules/veiculos/interfaces/request/IPostVeiculos';
import { ValidationError } from 'yup';
import { requiredField } from '@modules/veiculos/schemas/messages/fieldsMessageValidation';
import Context from '../../../patterns/strategy/schemas/Context';
import YupValidation from '../../../patterns/strategy/schemas/Yup';

type ISut = {
  context: Context<IPostVeiculos>;
  yupValidation: YupValidation<IPostVeiculos>;
  createVeiculoRules: IValidationRules;
  createAquisicaoRules: IValidationRules;
};

describe.skip('Unit test for veiculo post request', () => {
  let sut = {} as ISut;
  const makeSut = (): ISut => {
    const yupValidation = container.resolve<YupValidation<IPostVeiculos>>(
      YupValidation,
    );
    const context = new Context<IPostVeiculos>();

    return {
      context,
      yupValidation,
      createVeiculoRules,
      createAquisicaoRules,
    };
  };

  beforeEach(() => {
    sut = makeSut();
  });

  test('Context should be instance of YupValidation ', () => {
    sut.context.setStrategy(sut.yupValidation);

    expect(sut.context.getStrategy()).toBeInstanceOf(YupValidation);
  });

  test('should throw an error if combustivel is invalid', async () => {
    sut.context.setStrategy(sut.yupValidation);
    const schema = sut.context.createSchema(createVeiculoRules);

    try {
      await sut.context.validateData(schema, { combustivel: 'auhgr' });
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.value).toEqual({ combustivel: 'auhgr' });
      expect(error.errors[0]).toEqual('Tipo de combustivel inválido');
    }
  });

  test('should throw an error if combustivel is not set', async () => {
    sut.context.setStrategy(sut.yupValidation);
    const aquisicaoSchema = sut.context.createSchema(createAquisicaoRules);

    let schema = sut.context.createSchema(createVeiculoRules);
    schema = sut.context.concatSchema(schema, aquisicaoSchema, 'aquisicao');

    try {
      await sut.context.validateData(schema, {});
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.value).toEqual({
        aquisicao: { origem_aquisicao: undefined },
      });
      expect(error.errors[1]).toEqual(requiredField('Combustível'));
    }
  });

  test('should return an object containing combustivel if combustivel is validated', async () => {
    sut.context.setStrategy(sut.yupValidation);
    const schema = sut.context.createSchema(createVeiculoRules);

    const objectToValidate = {
      combustivel: '1',
    };

    try {
      const response = await sut.context.validateData(schema, {
        ...objectToValidate,
        aquisicao: {
          origem_aquisicao: '1',
        },
      });

      expect(response).toMatchObject(objectToValidate);
    } catch (error) {
      expect(undefined).toBeTruthy();
    }
  });

  test('should return an object containing trimmed combustivel', async () => {
    sut.context.setStrategy(sut.yupValidation);
    const schema = sut.context.createSchema(createVeiculoRules);

    const objectToValidate = {
      combustivel: '1  ',
    };

    try {
      const response = await sut.context.validateData(schema, {
        ...objectToValidate,
        aquisicao: {
          origem_aquisicao: '1',
        },
      });

      expect(response).toMatchObject({ combustivel: '1' });
    } catch (error) {
      expect(undefined).toBeTruthy();
    }
  });
});
