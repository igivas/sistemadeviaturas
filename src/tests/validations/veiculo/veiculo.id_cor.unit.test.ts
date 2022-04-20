import 'reflect-metadata';
import { container } from 'tsyringe';
import { createVeiculoRules } from '@modules/veiculos/schemas/rules/veiculoRules';
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
    };
  };

  beforeEach(() => {
    sut = makeSut();
  });

  test('Context should be instance of YupValidation ', () => {
    sut.context.setStrategy(sut.yupValidation);

    expect(sut.context.getStrategy()).toBeInstanceOf(YupValidation);
  });

  test('should throw an error if id_cor is not set', async () => {
    sut.context.setStrategy(sut.yupValidation);
    const schema = sut.context.createSchema(createVeiculoRules);

    try {
      await sut.context.validateData(schema, {});
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.value).toEqual({});
      expect(error.errors[0]).toEqual(requiredField('Cor'));
    }
  });

  test('should throw an error if id_cor is invalid', async () => {
    sut.context.setStrategy(sut.yupValidation);
    const schema = sut.context.createSchema(createVeiculoRules);

    try {
      await sut.context.validateData(schema, { id_cor: 'auhgr' });
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.value).toEqual({ id_cor: Number.NaN });
      expect(error.errors[0]).toEqual('Campo de cor deve ser um numero');
    }
  });

  test('should return an object containing id_cor if id_cor is validated', async () => {
    sut.context.setStrategy(sut.yupValidation);
    const schema = sut.context.createSchema(createVeiculoRules);

    const response = await sut.context.validateData(schema, {
      id_cor: 1,
    });

    expect(response).toMatchObject({ id_cor: 1 });
  });
});
