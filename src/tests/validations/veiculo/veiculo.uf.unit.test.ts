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

  test('should throw an error if uf is invalid', async () => {
    sut.context.setStrategy(sut.yupValidation);
    const schema = sut.context.createSchema(createVeiculoRules);

    try {
      await sut.context.validateData(schema, { uf: 'auhgr' });
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.value).toEqual({ uf: Number.NaN });
      expect(error.errors[0]).toEqual('Campo de uf deve ser um numero');
    }
  });

  test('should throw an error if uf is not set', async () => {
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
      expect(error.errors[1]).toEqual(requiredField('Estado'));
    }
  });

  test('should return an object containing uf if uf is validated', async () => {
    sut.context.setStrategy(sut.yupValidation);
    const schema = sut.context.createSchema(createVeiculoRules);

    const objectToValidate = {
      uf: 1,
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
