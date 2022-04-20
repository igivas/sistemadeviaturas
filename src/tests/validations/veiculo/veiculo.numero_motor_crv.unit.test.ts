import 'reflect-metadata';
import { container } from 'tsyringe';
import { createVeiculoRules } from '@modules/veiculos/schemas/rules/veiculoRules';
import { IValidationRules } from '@modules/veiculos/interfaces/validation/IValidationRules';
import { IPostVeiculos } from '@modules/veiculos/interfaces/request/IPostVeiculos';
import { ValidationError } from 'yup';
import {
  maxLengthRequiredField,
  requiredField,
} from '@modules/veiculos/schemas/messages/fieldsMessageValidation';
import { createAquisicaoRules } from '@modules/veiculos/schemas/rules/aquisicaoRules';
import Context from '../../../patterns/strategy/schemas/Context';
import YupValidation from '../../../patterns/strategy/schemas/Yup';

type ISut = {
  context: Context<IPostVeiculos>;
  yupValidation: YupValidation<IPostVeiculos>;
  createVeiculoRules: IValidationRules;
  createAquisicaoRules: IValidationRules;
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

  test('should throw an error if numero_motor is invalid', async () => {
    sut.context.setStrategy(sut.yupValidation);
    const schema = sut.context.createSchema(createVeiculoRules);

    const numero_motor = makeid(21);

    const expectedNumeroMotor = numero_motor;

    try {
      await sut.context.validateData(schema, {
        numero_motor,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.value).toMatchObject({
        numero_motor: expectedNumeroMotor,
      });
      expect(error.errors[0]).toEqual(
        maxLengthRequiredField('Número Motor', 20),
      );
    }
  });

  test('should throw an error if uf is not set', async () => {
    sut.context.setStrategy(sut.yupValidation);
    const aquisicaoSchema = sut.context.createSchema(sut.createAquisicaoRules);

    let schema = sut.context.createSchema(createVeiculoRules);
    schema = sut.context.concatSchema(schema, aquisicaoSchema, 'aquisicao');

    try {
      await sut.context.validateData(schema, {});
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.value).toEqual({
        aquisicao: { origem_aquisicao: undefined },
      });
      expect(error.errors[1]).toEqual(requiredField('Valor Fipe'));
    }
  });

  test('should return an object containing numero_motor if numero_motor is validated', async () => {
    sut.context.setStrategy(sut.yupValidation);
    const schema = sut.context.createSchema(createVeiculoRules);

    const response = await sut.context.validateData(schema, {
      numero_motor: '123123',
    });

    expect(response).toMatchObject({ numero_motor: '123123' });
  });
});
