import 'reflect-metadata';
import { createConnection } from 'typeorm';
import container from '../../../container';
import AppError from '../../../errors/AppError';
import { EOrigemDeAquisicao } from '../enums/EAquisicao';
import EEspecieVeiculo from '../enums/EEspecieVeiculo';
import { EEmprego } from '../enums/EPrefixo';

import CoreVeiculos from './CoreVeiculos';

describe.skip('Integration test suit for coreVeiculos', () => {
  let coreVeiculos: CoreVeiculos;

  beforeAll(async () => {
    await createConnection();
    coreVeiculos = container.resolve(CoreVeiculos);
  });

  test('should throw an error on invalid type origem_aquisicao', async () => {
    try {
      await coreVeiculos.showFrota({
        opms: ['1472'],
        especies: [EEspecieVeiculo.Automóvel],
        aquisicao: '3' as EOrigemDeAquisicao,
        empregos: [EEmprego['Operacional - Inteligência']],
        situacao: '4',
      });
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe('Tipo de origem de aquisicao invalido');
    }
  });

  test('should throw an error on invalid type especie', async () => {
    try {
      await coreVeiculos.showFrota({
        opms: ['1472'],
        especies: [25 as EEspecieVeiculo],
        aquisicao: EOrigemDeAquisicao.ORGANICO,
        empregos: [EEmprego['Operacional - Inteligência']],
        situacao: '4',
      });
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe('Tipo(s) de especie(s) invalido(s)');
    }
  });

  test('should throw an error on invalid type emprego', async () => {
    try {
      await coreVeiculos.showFrota({
        opms: ['1472'],
        especies: [EEspecieVeiculo.Automóvel],
        aquisicao: EOrigemDeAquisicao.ORGANICO,
        empregos: ['12' as EEmprego],
        situacao: '4',
      });
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe('Tipo(s) de empregos(s) invalido(s)');
    }
  });

  test('should throw an error on invalid type situacao', async () => {
    try {
      await coreVeiculos.showFrota({
        opms: ['1472'],
        especies: [EEspecieVeiculo.Automóvel],
        aquisicao: EOrigemDeAquisicao.ORGANICO,
        empregos: [EEmprego['Operacional - Caracterizada']],
        situacao: 'bs',
      });
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe('Tipo de situacao invalido');
    }
  });

  test.skip('should correctly find veiculos quantity by especie', async () => {
    const response = await coreVeiculos.showFrota({
      opms: ['1472'],
      especies: [EEspecieVeiculo.Motocicleta],
      aquisicao: EOrigemDeAquisicao.ORGANICO,
      empregos: [EEmprego['Operacional - Caracterizada']],
      situacao: '4',
    });

    expect(response).toBe(3);
  });

  test('should correctly find veiculos quantity by especie and aquisicao', async () => {
    const response = await coreVeiculos.showFrota({
      opms: ['1472'],
      especies: [EEspecieVeiculo.Motocicleta],
      aquisicao: EOrigemDeAquisicao.ORGANICO,
      empregos: [EEmprego['Operacional - Caracterizada']],
      situacao: '4',
    });

    expect(response).toBe(2);
  });

  test('should correctly find veiculos quantity by especie, aquisicao and situacao', async () => {
    const response = await coreVeiculos.showFrota({
      opms: ['1472'],
      especies: [EEspecieVeiculo.Motocicleta],
      aquisicao: EOrigemDeAquisicao.ORGANICO,
      empregos: [EEmprego['Operacional - Caracterizada']],
      situacao: '4',
    });

    expect(response).toBe(2);
  });

  test('should correctly find veiculos quantity by especie, aquisicao and situacao', async () => {
    const response = await coreVeiculos.showFrota({
      opms: ['1472'],
      especies: [EEspecieVeiculo.Motocicleta],
      aquisicao: EOrigemDeAquisicao.CESSAO,
      empregos: [EEmprego['Operacional - Caracterizada']],
      situacao: '2',
    });

    expect(response).toBe(1);
  });

  test('should correctly find veiculos quantity by especie, aquisicao, situacao and opm', async () => {
    const response = await coreVeiculos.showFrota({
      opms: ['1472'],
      especies: [EEspecieVeiculo.Motocicleta],
      aquisicao: EOrigemDeAquisicao.CESSAO,
      empregos: [EEmprego['Operacional - Caracterizada']],
      situacao: '2',
    });

    expect(response).toBe(0);
  });

  test.only('should throw an error on invalid array value of opms on getLocaisExternos', async () => {
    try {
      await coreVeiculos.getLocaisExternos({
        opms: 'auiod',
        page: NaN,
        perPage: NaN,
        query: '',
      });
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe('Formato de valor inválido');
    }
  });

  test.only('should return all veiculos localizacoes by opms ', async () => {
    const {
      items: localizacoesExternas,
    } = await coreVeiculos.getLocaisExternos({
      opms: '1472',
      page: NaN,
      perPage: NaN,
      query: '',
    });
    expect(localizacoesExternas.length).toBeGreaterThan(0);
  });
});
