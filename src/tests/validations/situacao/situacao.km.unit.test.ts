import 'reflect-metadata';
import { container } from 'tsyringe';
import { IValidationRules } from '@modules/veiculos/interfaces/validation/IValidationRules';

import { ValidationError } from 'yup';
import { requiredField } from '@modules/veiculos/schemas/messages/fieldsMessageValidation';
import { createSituacaoRules } from '@modules/veiculos/schemas/rules/situacaoRules';
import { IPostSituacao } from '@modules/veiculos/interfaces/request/IPostSituacao';
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

  test('should throw an error if km is not set', async () => {
    sut.context.setStrategy(sut.yupValidation);
    const schema = sut.context.createSchema(createSituacaoRules);

    try {
      await sut.context.validateData(schema, {});
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.value).toEqual({});
      expect(error.errors[0]).toEqual(requiredField('Km'));
    }
  });

  test('should throw an error if km is invalid', async () => {
    sut.context.setStrategy(sut.yupValidation);
    const schema = sut.context.createSchema(createSituacaoRules);

    try {
      await sut.context.validateData(schema, { km: 'auhgr' });
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.value).toEqual({ km: Number.NaN });
      expect(error.errors[0]).toEqual('Apenas formato numérico');
    }
  });

  test('should return an object containing km if km is validated', async () => {
    sut.context.setStrategy(sut.yupValidation);
    const schema = sut.context.createSchema(createSituacaoRules);

    const response = await sut.context.validateData(schema, {
      km: 1,
    });

    expect(response).toMatchObject({ km: 1 });
  });
});
