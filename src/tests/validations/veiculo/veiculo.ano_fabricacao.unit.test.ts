import 'reflect-metadata';
import { container } from 'tsyringe';
import { createVeiculoRules } from '@modules/veiculos/schemas/rules/veiculoRules';
import { createAquisicaoRules } from '@modules/veiculos/schemas/rules/aquisicaoRules';
import { IValidationRules } from '@modules/veiculos/interfaces/validation/IValidationRules';

import { ValidationError } from 'yup';
import { requiredField } from '@modules/veiculos/schemas/messages/fieldsMessageValidation';
import { IPostVeiculos } from '@modules/veiculos/interfaces/request/IPostVeiculos';
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

  test('should throw an error if ano_modelo is invalid', async () => {
    sut.context.setStrategy(sut.yupValidation);
    const schema = sut.context.createSchema(createVeiculoRules);

    try {
      await sut.context.validateData(schema, { ano_modelo: 'auhgr' });
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.value).toEqual({ ano_modelo: Number.NaN });
      expect(error.errors[0]).toEqual('Ano modelo invalido');
    }
  });

  test('should throw an error if ano_modelo is invalid year', async () => {
    sut.context.setStrategy(sut.yupValidation);
    const schema = sut.context.createSchema(createVeiculoRules);

    try {
      await sut.context.validateData(schema, { ano_modelo: 12973 });
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.value).toEqual({ ano_modelo: 12973 });
      expect(error.errors[0]).toEqual('Ano modelo invalido');
    }
  });

  test('should throw an error if ano_modelo is not set', async () => {
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
      expect(error.errors[1]).toEqual(requiredField('Ano Modelo'));
    }
  });

  test('should return an object containing ano_modelo if ano_modelo is validated', async () => {
    sut.context.setStrategy(sut.yupValidation);
    const schema = sut.context.createSchema(createVeiculoRules);

    const objectToValidate = {
      ano_modelo: 1,
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
});
