import 'reflect-metadata';
import { prefixoSchema } from '@modules/veiculos/schemas/schemaContext';
import { EPrefixoTipo, EEmprego } from '@modules/veiculos/enums/EPrefixo';
import { ValidationError } from 'yup';
import context from '../../contexts/validationContext';

function makeString(length: number): string {
  const result = [];
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.split(
    '',
  );
  for (let i = 0; i < length; i += 1) {
    result.push(characters[Math.floor(Math.random() * characters.length)]);
  }
  return result.join('');
}

describe('Suite for integration tests of veiculo', () => {
  test('should thrown an error if emprego is not related to prefixo_tipo', async () => {
    try {
      await context.validateData(prefixoSchema, {
        prefixo_tipo: EPrefixoTipo['21 - ADM'],
        prefixo_sequencia: makeString(5),
        emprego: EEmprego['Operacional - Caracterizada'],
      });

      throw new Error();
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.errors[0]).toBe(
        'Emprego e Prefixo Tipo enviados nao se relacionam',
      );
    }
  });

  test('should return an object if emprego is related to prefixo_tipo', async () => {
    const response = await context.validateData(prefixoSchema, {
      prefixo_tipo: EPrefixoTipo['21 - ADM'],
      prefixo_sequencia: makeString(5),
      emprego: EEmprego['Não Consta'],
    });

    expect(response).toMatchObject({
      prefixo_tipo: EPrefixoTipo['21 - ADM'],
      emprego: EEmprego['Não Consta'],
    });
  });

  test('should return an object with prefixo_tipo trimmed at end', async () => {
    const prefixo_tipo = `${EPrefixoTipo['21 - ADM']}  `;
    const response = await context.validateData(prefixoSchema, {
      prefixo_tipo,
      prefixo_sequencia: makeString(5),
      emprego: EEmprego['Não Consta'],
    });

    expect(response).toMatchObject({
      prefixo_tipo: prefixo_tipo.trimRight(),
      emprego: EEmprego['Não Consta'],
    });
  });

  test('should return an object with emprego trimmed at end', async () => {
    const emprego = `${EEmprego['Não Consta']}  `;
    const response = await context.validateData(prefixoSchema, {
      prefixo_tipo: EPrefixoTipo['21 - ADM'],
      prefixo_sequencia: makeString(5),
      emprego,
    });

    expect(response).toMatchObject({
      prefixo_tipo: EPrefixoTipo['21 - ADM'],
      emprego: EEmprego['Não Consta'],
    });
  });

  test('should return an object with prefixo_sequencia trimmed at end', async () => {
    const prefixo_sequencia = `${makeString(5)}  `;
    const response = await context.validateData(prefixoSchema, {
      prefixo_tipo: EPrefixoTipo['21 - ADM'],
      prefixo_sequencia,
      emprego: EEmprego['Não Consta'],
    });

    expect(response).toMatchObject({
      prefixo_tipo: EPrefixoTipo['21 - ADM'],
      prefixo_sequencia: prefixo_sequencia.trimRight(),
      emprego: EEmprego['Não Consta'],
    });
  });
});
