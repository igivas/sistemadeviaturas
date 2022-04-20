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

  test('forma_aquisicao should be required when origem_aquisicao is 0', async () => {
    sut.context.setStrategy(sut.yupValidation);
    const schema = sut.context.createSchema(createAquisicaoRules);

    try {
      await sut.context.validateData(schema, { origem_aquisicao: '0' });
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.value).toMatchObject({ origem_aquisicao: '0' });
      expect(error.errors[0]).toEqual(requiredField('Forma Aquisição'));
    }
  });

  test('should throw error when forma_aquisicao is invalid value', async () => {
    sut.context.setStrategy(sut.yupValidation);
    const schema = sut.context.createSchema(createAquisicaoRules);

    try {
      await sut.context.validateData(schema, {
        origem_aquisicao: '0',
        forma_aquisicao: '14',
      });
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.value).toMatchObject({
        origem_aquisicao: '0',
        forma_aquisicao: '14',
      });
      expect(error.errors[0]).toEqual('Forma de aquisicao invalida');
    }
  });

  test('should return an object containing forma_aquisicao if forma_aquisicao is validated', async () => {
    sut.context.setStrategy(sut.yupValidation);
    const schema = sut.context.createSchema(createAquisicaoRules);

    const response = await sut.context.validateData(schema, {
      origem_aquisicao: '0',
      forma_aquisicao: '1',
    });

    expect(response).toMatchObject({ forma_aquisicao: '1' });
  });

  test('should return an object containing forma_aquisicao trimmed', async () => {
    sut.context.setStrategy(sut.yupValidation);
    const schema = sut.context.createSchema(createAquisicaoRules);

    const forma_aquisicao = '1   ';
    const response = await sut.context.validateData(schema, {
      origem_aquisicao: '0',
      forma_aquisicao,
    });

    expect(response).toMatchObject({ forma_aquisicao: '1' });
  });
});
