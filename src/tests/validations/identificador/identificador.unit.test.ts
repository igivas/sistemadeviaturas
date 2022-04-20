import 'reflect-metadata';
import { container } from 'tsyringe';
import { IValidationRules } from '@modules/veiculos/interfaces/validation/IValidationRules';
import { ValidationError } from 'yup';
import { IPostIdentificador } from '@modules/veiculos/interfaces/request/IPostIdentificador';
import { createIdentificadorRules } from '@modules/veiculos/schemas/rules/identificadorRules';
import { requiredField } from '@modules/veiculos/schemas/messages/fieldsMessageValidation';
import Context from '../../../patterns/strategy/schemas/Context';
import YupValidation from '../../../patterns/strategy/schemas/Yup';

type ISut = {
  context: Context<IPostIdentificador>;
  yupValidation: YupValidation<IPostIdentificador>;
  createIdentificadorRules: IValidationRules;
};

describe.skip('Unit test for identificador post request', () => {
  let sut = {} as ISut;
  const makeSut = (): ISut => {
    const yupValidation = container.resolve<YupValidation<IPostIdentificador>>(
      YupValidation,
    );
    const context = new Context<IPostIdentificador>();

    return {
      context,
      yupValidation,
      createIdentificadorRules,
    };
  };

  beforeEach(() => {
    sut = makeSut();
  });

  test('Context should be instance of YupValidation ', () => {
    sut.context.setStrategy(sut.yupValidation);

    expect(sut.context.getStrategy()).toBeInstanceOf(YupValidation);
  });

  test('should throw error when identificador is required', async () => {
    sut.context.setStrategy(sut.yupValidation);
    const schema = sut.context.createSchema(createIdentificadorRules);

    try {
      await sut.context.validateData(schema, {});
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.value).toMatchObject({});
      expect(error.errors[0]).toEqual(requiredField('Identificador'));
    }
  });

  test('should return an object containing identificador if valor_aquisicao is validated', async () => {
    sut.context.setStrategy(sut.yupValidation);
    const schema = sut.context.createSchema(createIdentificadorRules);

    const response = await sut.context.validateData(schema, {
      identificador: '16423',
    });

    expect(response).toMatchObject({ identificador: '16423' });
  });

  test('should return an object containing trimmed identificador', async () => {
    sut.context.setStrategy(sut.yupValidation);
    const schema = sut.context.createSchema(createIdentificadorRules);

    const response = await sut.context.validateData(schema, {
      identificador: '16423  ',
    });

    expect(response).toMatchObject({ identificador: '16423' });
  });
});
