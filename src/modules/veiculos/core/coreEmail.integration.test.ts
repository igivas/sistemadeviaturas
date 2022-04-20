import 'reflect-metadata';
import { createConnection } from 'typeorm';
import container from '../../../container';
import AppError from '../../../errors/AppError';
import Email from '../entities/Email';
import CoreEmail from './CoreEmail';

describe.skip('Integration tests suite for coreEmail', () => {
  let coreEmail: CoreEmail;
  let createdEmail: Email[];
  let id = 1;

  beforeAll(async () => {
    await createConnection();
    coreEmail = container.resolve(CoreEmail);
  });

  test('should return a valid email', async () => {
    createdEmail = await coreEmail.create(
      { emails: [`exemplo${id}@email.com`] },
      '30891368',
    );

    expect(createdEmail[0].email).toBe(`exemplo${id}@email.com`);
    id += 1;

    expect(createdEmail.length).toBe(1);
  });

  test('should throw an error on attempt to create an existent email', async () => {
    try {
      await coreEmail.create(
        { emails: [`exemplo${id - 1}@email.com`] },
        '30891368',
      );

      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect((error as AppError).message).toBe(
        `O(s) email(s) exemplo${id - 1}@email.com ja existem neste banco`,
      );
    }
  });

  test('should throw an error on attempt to update non existent email', async () => {
    try {
      await coreEmail.update('uuid', {
        ativo: '1',
        email: `exemplo${id - 1}@email.com`,
        atualizado_por: '30891368',
      });
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect((error as AppError).message).toBe(`O email não existe`);
    }
  });

  test('should update an existent email', async () => {
    const response = await coreEmail.update(createdEmail[0].id_email, {
      email: `exemplo${id}@email.com`,
      atualizado_por: '30891368',
    });

    expect(response.email).toBe(`exemplo${id}@email.com`);
  });

  test('should throw an error on invalid pagination on find emails', async () => {
    try {
      await coreEmail.list({ page: 'page1', perPage: 'perpage2' });
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe('Formato de Paginação invalido');
    }
  });

  test('should return an list of emails with pagination', async () => {
    const response = await coreEmail.list({ page: '1', perPage: '10' });
    expect(response.total).toBe(1);
    expect(response.items[0]).toMatchObject({
      email: `exemplo${id}@email.com`,
      ativo: '1',
      criado_por: '30891368',
    });
  });

  test('should return an list of emails with provided email with pagination', async () => {
    const response = await coreEmail.list({
      page: '1',
      perPage: '10',
      email: 'nash',
    });

    expect(response.total).toBe(0);
  });

  test('should return an list of inactive emails with pagination', async () => {
    const updatedEmail = await coreEmail.update(createdEmail[0].id_email, {
      email: `exemplo${id}@email.com`,
      atualizado_por: '30891368',
      ativo: '0',
    });

    const response = await coreEmail.list({
      page: '1',
      perPage: '10',
      active: '0',
    });

    expect(response.total).toBe(1);
    expect(response.items[0]).toMatchObject(updatedEmail);
  });
});
