import 'reflect-metadata';
import { container } from 'tsyringe';
import { IValidationRules } from '@modules/veiculos/interfaces/validation/IValidationRules';
import { ValidationError } from 'yup';
import { requiredField } from '@modules/veiculos/schemas/messages/fieldsMessageValidation';
import { IPostPrefixo } from '@modules/veiculos/interfaces/request/IPostPrefixo';
import { createPrefixoRules } from '@modules/veiculos/schemas/rules/prefixoRules';
import { EEmprego } from '@modules/veiculos/enums/EPrefixo';
import Context from '../../../patterns/strategy/schemas/Context';
import YupValidation from '../../../patterns/strategy/schemas/Yup';

type ISut = {
  context: Context<IPostPrefixo>;
  yupValidation: YupValidation<IPostPrefixo>;
  createPrefixoRules: IValidationRules;
};

describe.skip('Unit test for veiculo post request', () => {
  let sut = {} as ISut;
  const makeSut = (): ISut => {
    const yupValidation = container.resolve<YupValidation<IPostPrefixo>>(
      YupValidation,
    );
    const context = new Context<IPostPrefixo>();

    return {
      context,
      yupValidation,
      createPrefixoRules,
    };
  };

  beforeEach(() => {
    sut = makeSut();
  });

  test('Context should be instance of YupValidation ', () => {
    sut.context.setStrategy(sut.yupValidation);

    expect(sut.context.getStrategy()).toBeInstanceOf(YupValidation);
  });

  test('should throw an error if emprego is empty', async () => {
    sut.context.setStrategy(sut.yupValidation);
    const schema = sut.context.createSchema(createPrefixoRules);

    try {
      await sut.context.validateData(schema, {});
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.value).toEqual({});
      expect(error.errors[0]).toEqual(requiredField('Emprego'));
    }
  });

  test('should throw an error if emprego is invalid', async () => {
    sut.context.setStrategy(sut.yupValidation);
    const schema = sut.context.createSchema(createPrefixoRules);

    try {
      await sut.context.validateData(schema, { emprego: '143' });
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.value).toEqual({ emprego: '143' });
      expect(error.errors[0]).toEqual('Tipo de emprego invalido');
    }
  });

  test('should return an object containing emprego if emprego is validated', async () => {
    sut.context.setStrategy(sut.yupValidation);
    const schema = sut.context.createSchema(createPrefixoRules);

    const objectToValidate = {
      emprego: EEmprego.Ambulância,
    };

    try {
      const response = await sut.context.validateData(schema, {
        ...objectToValidate,
      });

      expect(response).toMatchObject(objectToValidate);
    } catch (error) {
      expect(undefined).toBeTruthy();
    }
  });
});
