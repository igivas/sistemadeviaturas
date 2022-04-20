import 'reflect-metadata';
import { container } from 'tsyringe';
import { IValidationRules } from '@modules/veiculos/interfaces/validation/IValidationRules';
import { ValidationError } from 'yup';
import { createAquisicaoRules } from '@modules/veiculos/schemas/rules/aquisicaoRules';
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

  test('should throw an error if valor_aquisicao is invalid', async () => {
    sut.context.setStrategy(sut.yupValidation);
    const schema = sut.context.createSchema(createAquisicaoRules);

    try {
      await sut.context.validateData(schema, {
        origem_aquisicao: '0',
        forma_aquisicao: '0',
        valor_aquisicao: 'abc',
      });
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.value).toMatchObject({ valor_aquisicao: Number.NaN });
      expect(error.errors[0]).toEqual('Valor de aquisição invalido');
    }
  });

  test('id_orgao_aquisicao should be required when origem_aquisicao is 0 and forma_aquisicao is 0', async () => {
    sut.context.setStrategy(sut.yupValidation);
    const schema = sut.context.createSchema(createAquisicaoRules);

    try {
      await sut.context.validateData(schema, {
        origem_aquisicao: '0',
        forma_aquisicao: '0',
      });
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.value).toMatchObject({
        origem_aquisicao: '0',
        forma_aquisicao: '0',
      });
      expect(error.errors[0]).toEqual(
        'Campo de Valor de Aquisicao é requerido',
      );
    }
  });

  test('should throw error if valor_aquisicao > 99000000', async () => {
    sut.context.setStrategy(sut.yupValidation);
    const schema = sut.context.createSchema(createAquisicaoRules);

    try {
      await sut.context.validateData(schema, {
        origem_aquisicao: '0',
        forma_aquisicao: '0',
        valor_aquisicao: 99000001,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.value).toMatchObject({
        origem_aquisicao: '0',
        forma_aquisicao: '0',
        valor_aquisicao: 99000001,
      });
      expect(error.errors[0]).toEqual('Valor maior que R$ 99.000.000');
    }
  });

  test('should return an object containing valor_aquisicao if valor_aquisicao is validated', async () => {
    sut.context.setStrategy(sut.yupValidation);
    const schema = sut.context.createSchema(createAquisicaoRules);

    const response = await sut.context.validateData(schema, {
      origem_aquisicao: '0',
      forma_aquisicao: '0',
      valor_aquisicao: '1.33',
    });

    expect(response).toMatchObject({ valor_aquisicao: 1.33 });
  });
});
