import 'reflect-metadata';
import { container } from 'tsyringe';
import { createVeiculoRules } from '@modules/veiculos/schemas/rules/veiculoRules';
import { IValidationRules } from '@modules/veiculos/interfaces/validation/IValidationRules';
import { IPostVeiculos } from '@modules/veiculos/interfaces/request/IPostVeiculos';
import { ValidationError } from 'yup';
import Context from '../../../patterns/strategy/schemas/Context';
import YupValidation from '../../../patterns/strategy/schemas/Yup';

type ISut = {
  context: Context<IPostVeiculos>;
  yupValidation: YupValidation<IPostVeiculos>;
  createVeiculoRules: IValidationRules;
};

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

  test('should throw an error if referenciasPneus is invalid', async () => {
    sut.context.setStrategy(sut.yupValidation);
    const schema = sut.context.createSchema(createVeiculoRules);

    try {
      await sut.context.validateData(schema, {
        aquisicao: { origem_aquisicao: '0' },
        referenciasPneus: 1,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.value).toMatchObject({ referenciasPneus: null });
      expect(error.errors[0]).toEqual('Tipo de referencia de Pneu invalido');
    }
  });

  test('should throw an error on empty array referenciaPneu', async () => {
    sut.context.setStrategy(sut.yupValidation);
    const schema = sut.context.createSchema(createVeiculoRules);

    try {
      await sut.context.validateData(schema, {
        aquisicao: { origem_aquisicao: '0' },
        referenciasPneus: [],
      });
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.value).toMatchObject({ referenciasPneus: [] });
      expect(error.errors[0]).toEqual(
        'Campo de Referencia de Pneu é necessario',
      );
    }
  });

  test('should throw an error on empty object containing id_pneu', async () => {
    sut.context.setStrategy(sut.yupValidation);
    const schema = sut.context.createSchema(createVeiculoRules);

    try {
      await sut.context.validateData(schema, {
        referenciasPneus: [{}],
      });
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.value).toMatchObject({ referenciasPneus: [{}] });
      expect(error.errors[0]).toEqual('Id de Referencia de Pneu é requerida');
    }
  });

  test('should throw an error on invalid id_pneu type', async () => {
    sut.context.setStrategy(sut.yupValidation);
    const schema = sut.context.createSchema(createVeiculoRules);

    try {
      await sut.context.validateData(schema, {
        referenciasPneus: [{ id_pneu: 'asuh' }],
      });
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.value).toMatchObject({
        referenciasPneus: [{ id_pneu: Number.NaN }],
      });
      expect(error.errors[0]).toEqual('Valor de Referencia de Pneu Invalido');
    }
  });

  test('should throw an error on invalid id_pneu value', async () => {
    sut.context.setStrategy(sut.yupValidation);
    const schema = sut.context.createSchema(createVeiculoRules);

    try {
      await sut.context.validateData(schema, {
        referenciasPneus: [{ id_pneu: -1 }],
      });
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.value).toMatchObject({
        referenciasPneus: [{ id_pneu: -1 }],
      });
      expect(error.errors[0]).toEqual('Numero invalido de referencia de Pneu');
    }
  });

  test('should throw an error on invalid property id_pneu', async () => {
    sut.context.setStrategy(sut.yupValidation);
    const schema = sut.context.createSchema(createVeiculoRules);

    try {
      await sut.context.validateData(schema, {
        referenciasPneus: [{ id_pneu: -1 }],
      });
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.value).toMatchObject({
        referenciasPneus: [{ id_pneu: -1 }],
      });
      expect(error.errors[0]).toEqual('Numero invalido de referencia de Pneu');
    }
  });

  test('should return an object containing referenciasPneus if referenciasPneus is validated', async () => {
    sut.context.setStrategy(sut.yupValidation);
    const schema = sut.context.createSchema(createVeiculoRules);

    const response = await sut.context.validateData(schema, {
      referenciasPneus: [{ id_pneu: 1 }],
    });

    expect(response).toMatchObject({ referenciasPneus: [{ id_pneu: 1 }] });
  });
});
