import 'reflect-metadata';
import { container } from 'tsyringe';

import { IValidationRules } from '@modules/veiculos/interfaces/validation/IValidationRules';
import { ValidationError } from 'yup';

import { IPostSituacao } from '@modules/veiculos/interfaces/request/IPostSituacao';
import { createSituacaoRules } from '@modules/veiculos/schemas/rules/situacaoRules';
import { requiredField } from '@modules/veiculos/schemas/messages/fieldsMessageValidation';
import Context from '../../../patterns/strategy/schemas/Context';
import YupValidation from '../../../patterns/strategy/schemas/Yup';

type ISut = {
  context: Context<IPostSituacao>;
  yupValidation: YupValidation<IPostSituacao>;
  createSituacaoRules: IValidationRules;
};

describe.skip('Unit test for veiculo post request', () => {
  let sut = {} as ISut;
  const makeSut = (): ISut => {
    const yupValidation = container.resolve<YupValidation<IPostSituacao>>(
      YupValidation,
    );
    const context = new Context<IPostSituacao>();

    return {
      context,
      yupValidation,
      createSituacaoRules,
    };
  };

  beforeEach(() => {
    sut = makeSut();
  });

  test('Context should be instance of YupValidation ', () => {
    sut.context.setStrategy(sut.yupValidation);

    expect(sut.context.getStrategy()).toBeInstanceOf(YupValidation);
  });

  test('should throw an error if data_situacao is not set', async () => {
    sut.context.setStrategy(sut.yupValidation);
    const schema = sut.context.createSchema(createSituacaoRules);

    try {
      await sut.context.validateData(schema, {});
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.value).toEqual({});
      expect(error.errors[0]).toEqual(requiredField('Data é requerida'));
    }
  });

  test('should throw an error if data_situacao is invalid', async () => {
    sut.context.setStrategy(sut.yupValidation);
    const schema = sut.context.createSchema(createSituacaoRules);

    try {
      await sut.context.validateData(schema, { data_situacao: 'asdf' });
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);

      expect(error.errors[0]).toEqual('Data em formato invalido');
    }
  });

  test('should return an object containing data_situacao if data_situacao is validated', async () => {
    sut.context.setStrategy(sut.yupValidation);
    const schema = sut.context.createSchema(createSituacaoRules);

    const data_situacao = '2020-12-31T03:00:00.000Z';

    const expectedDataDocCarga = data_situacao;

    const response = await sut.context.validateData(schema, {
      data_situacao,
    });

    expect(response).toEqual({
      data_situacao: new Date(expectedDataDocCarga),
    });
  });
});
