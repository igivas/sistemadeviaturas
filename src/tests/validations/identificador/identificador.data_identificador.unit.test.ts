import 'reflect-metadata';
import { container } from 'tsyringe';
import { IValidationRules } from '@modules/veiculos/interfaces/validation/IValidationRules';
import { ValidationError } from 'yup';

import {
  requiredField,
  dateTypeErrorField,
} from '@modules/veiculos/schemas/messages/fieldsMessageValidation';

import { IPostIdentificador } from '@modules/veiculos/interfaces/request/IPostIdentificador';
import { createIdentificadorRules } from '@modules/veiculos/schemas/rules/identificadorRules';
import Context from '../../../patterns/strategy/schemas/Context';
import YupValidation from '../../../patterns/strategy/schemas/Yup';

type ISut = {
  context: Context<IPostIdentificador>;
  yupValidation: YupValidation<IPostIdentificador>;
  createIdentificadorRules: IValidationRules;
};

describe.skip('Unit test for veiculo post request', () => {
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

  test('should throw an error if data_identificador is empty', async () => {
    sut.context.setStrategy(sut.yupValidation);
    const schema = sut.context.createSchema(createIdentificadorRules);

    try {
      await sut.context.validateData(schema, {});
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.value).toMatchObject({});
      expect(error.errors[0]).toEqual(requiredField('Data Identificador'));
    }
  });

  test('should throw an error if data_identificador is invalid', async () => {
    sut.context.setStrategy(sut.yupValidation);
    const schema = sut.context.createSchema(createIdentificadorRules);

    try {
      await sut.context.validateData(schema, { data_identificador: '1234a' });
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.errors[0]).toEqual(dateTypeErrorField('Data Identificador'));
    }
  });

  test('should return an object containing data_identificador if data_identificador is validated', async () => {
    sut.context.setStrategy(sut.yupValidation);
    const schema = sut.context.createSchema(createIdentificadorRules);

    const data_identificador = '2020-12-31T03:00:00.000Z';

    const expectedDataAquisicao = data_identificador;

    const response = await sut.context.validateData(schema, {
      data_identificador,
    });

    expect(response).toEqual({
      data_identificador: new Date(expectedDataAquisicao),
    });
  });
});
