import 'reflect-metadata';
import { container } from 'tsyringe';
import { createVeiculoRules } from '@modules/veiculos/schemas/rules/veiculoRules';
import { IValidationRules } from '@modules/veiculos/interfaces/validation/IValidationRules';
import { ValidationError } from 'yup';
import { IPostVeiculos } from '@modules/veiculos/interfaces/request/IPostVeiculos';
import { maxLengthRequiredField } from '@modules/veiculos/schemas/messages/fieldsMessageValidation';
import Context from '../../../patterns/strategy/schemas/Context';
import YupValidation from '../../../patterns/strategy/schemas/Yup';

type ISut = {
  context: Context<IPostVeiculos>;
  yupValidation: YupValidation<IPostVeiculos>;
  createVeiculoRules: IValidationRules;
};

function makeid(length: number): string {
  const result = [];
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.split(
    '',
  );
  for (let i = 0; i < length; i += 1) {
    result.push(characters[Math.floor(Math.random() * characters.length)]);
  }
  return result.join('');
}

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

  test('should throw an error if renavam is invalid length', async () => {
    sut.context.setStrategy(sut.yupValidation);
    const schema = sut.context.createSchema(createVeiculoRules);

    const renavamExample = makeid(19);

    try {
      await sut.context.validateData(schema, {
        renavam: renavamExample,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.value).toMatchObject({
        renavam: renavamExample.toUpperCase(),
      });
      expect(error.errors[0]).toEqual(maxLengthRequiredField('Renavam', 11));
    }
  });

  test('should throw an error if renavam is invalid value', async () => {
    sut.context.setStrategy(sut.yupValidation);
    const schema = sut.context.createSchema(createVeiculoRules);

    const renavamExample = 'abc';

    try {
      await sut.context.validateData(schema, {
        renavam: renavamExample,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.value).toMatchObject({
        renavam: renavamExample.toUpperCase(),
      });
      expect(error.errors[0]).toEqual('Renavam deve conter apenas Numeros');
    }
  });

  test('should return an object containing renavam if renavam is validated', async () => {
    sut.context.setStrategy(sut.yupValidation);
    const schema = sut.context.createSchema(createVeiculoRules);

    const response = await sut.context.validateData(schema, {
      renavam: '1311',
    });

    expect(response).toMatchObject({ renavam: '1311' });
  });
});
