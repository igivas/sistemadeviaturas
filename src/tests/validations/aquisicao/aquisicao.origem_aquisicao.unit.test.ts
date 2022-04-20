import 'reflect-metadata';
import { container } from 'tsyringe';
import { IValidationRules } from '@modules/veiculos/interfaces/validation/IValidationRules';

import { ValidationError } from 'yup';
import { createAquisicaoRules } from '@modules/veiculos/schemas/rules/aquisicaoRules';
import { requiredField } from '@modules/veiculos/schemas/messages/fieldsMessageValidation';
import { IPostAquisicao } from '@modules/veiculos/interfaces/request/IPostAquisicao';
import Context from '../../../patterns/strategy/schemas/Context';
import YupValidation from '../../../patterns/strategy/schemas/Yup';

type ISut = {
  context: Context<IPostAquisicao>;
  yupValidation: YupValidation<IPostAquisicao>;
  createAquisicaoRules: IValidationRules;
};

describe.skip('Unit test for veiculo post request', () => {
  let sut = {} as ISut;
  const makeSut = (): ISut => {
    const yupValidation = container.resolve<YupValidation<IPostAquisicao>>(
      YupValidation,
    );
    const context = new Context<IPostAquisicao>();

    return {
      context,
      yupValidation,
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

  test('should throw an error if origem_aquisicao is empty', async () => {
    sut.context.setStrategy(sut.yupValidation);
    const schema = sut.context.createSchema(createAquisicaoRules);

    try {
      await sut.context.validateData(schema, {});
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.value).toMatchObject({});
      expect(error.errors[0]).toEqual(requiredField('Origem Aquisicao'));
    }
  });

  test('should throw an error if origem_aquisicao is invalid', async () => {
    sut.context.setStrategy(sut.yupValidation);
    const schema = sut.context.createSchema(createAquisicaoRules);

    try {
      await sut.context.validateData(schema, { origem_aquisicao: '1234' });
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.value).toMatchObject({ origem_aquisicao: '1234' });
      expect(error.errors[0]).toEqual('Origem Aquisicao invalido');
    }
  });

  test('should return an object containing origem_aquisicao if origem_aquisicao is validated', async () => {
    sut.context.setStrategy(sut.yupValidation);
    const schema = sut.context.createSchema(createAquisicaoRules);

    const response = await sut.context.validateData(schema, {
      origem_aquisicao: '1',
    });

    expect(response).toMatchObject({ origem_aquisicao: '1' });
  });

  test('should return an object containg origem aquisicao trimmed', async () => {
    sut.context.setStrategy(sut.yupValidation);
    const schema = sut.context.createSchema(createAquisicaoRules);

    const response = await sut.context.validateData(schema, {
      origem_aquisicao: '1  ',
    });

    expect(response).toMatchObject({ origem_aquisicao: '1'.trimRight() });
  });
});
