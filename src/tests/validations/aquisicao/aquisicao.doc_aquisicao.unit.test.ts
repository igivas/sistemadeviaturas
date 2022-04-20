import 'reflect-metadata';
import { container } from 'tsyringe';
import { IValidationRules } from '@modules/veiculos/interfaces/validation/IValidationRules';
import { createAquisicaoRules } from '@modules/veiculos/schemas/rules/aquisicaoRules';
import { IPostVeiculos } from '@modules/veiculos/interfaces/request/IPostVeiculos';
import Context from '../../../patterns/strategy/schemas/Context';
import YupValidation from '../../../patterns/strategy/schemas/Yup';

type ISut = {
  context: Context<IPostVeiculos>;
  yupValidation: YupValidation<IPostVeiculos>;
  createAquisicaoRules: IValidationRules;
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

  test('should return an object containing doc_aquisicao if doc_aquisicao is validated', async () => {
    sut.context.setStrategy(sut.yupValidation);
    const schema = sut.context.createSchema(createAquisicaoRules);

    const response = await sut.context.validateData(schema, {
      doc_aquisicao: 'poi1311',
    });

    expect(response).toMatchObject({ doc_aquisicao: 'poi1311' });
  });
});
