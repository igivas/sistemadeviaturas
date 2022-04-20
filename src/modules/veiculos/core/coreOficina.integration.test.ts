import { createConnection } from 'typeorm';
import AppError from '../../../errors/AppError';
import container from '../../../container';
import { IPostOficina } from '../interfaces/request/IPostOficina';
import CoreOficina from './CoreOficina';

describe('Integration test suite for coreOficina', () => {
  let coreOficina: CoreOficina;
  let id = 1;
  let uuid: string;

  beforeAll(async () => {
    await createConnection();
    coreOficina = container.resolve(CoreOficina);
  });

  test('should create an array oficina', async () => {
    const oficinaToCreate: IPostOficina = {
      oficinas: [
        {
          ativo: '1',
          cpf_cnpj: '02034282345',
          endereco: `rua chico mota ${id}`,
          nome: `Oficina ${id}`,
          numero: '1234',
          id_municipio: '230440',
        },
      ],
      criado_por: '30891368',
    };

    const response = await coreOficina.create(oficinaToCreate);

    uuid = response[0].id_oficina;

    expect(response.length).toBe(oficinaToCreate.oficinas.length);
    expect(response[0]).toMatchObject(oficinaToCreate.oficinas[0]);
  });

  test('should throw an error if oficina name already exists', async () => {
    try {
      await coreOficina.create({
        oficinas: [
          {
            ativo: '1',
            cpf_cnpj: '02034282345',
            endereco: `rua chico mota ${id}`,
            nome: 'Oficina 1',
            numero: '1234',
            id_municipio: '230440',
          },
        ],
        criado_por: '30891368',
      });
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe(`A oficina 'Oficina 1' já consta no banco`);
    }
  });

  test('should load all oficina matriz', async () => {
    const response = await coreOficina.listOficinaMatriz();

    expect(response.length).toBe(id);
  });

  test('should create oficina with id_oficina_pai', async () => {
    id += 1;
    const oficinaToCreate: IPostOficina = {
      oficinas: [
        {
          ativo: '1',
          cpf_cnpj: '02034282345',
          endereco: `rua chico mota ${id}`,
          nome: `Oficina ${id}`,
          numero: '1234',
          id_municipio: '230440',
          id_oficina_pai: uuid as string,
        },
      ],
      criado_por: '30891368',
    };

    const response = await coreOficina.create(oficinaToCreate);

    expect(response[0]).toMatchObject({
      ativo: '1',
      cpf_cnpj: '02034282345',
      endereco: 'rua chico mota 627',
      id_oficina_pai: id - 1,
    });
  });

  test('should throw an error if page is NAN', async () => {
    try {
      await coreOficina.list({ page: Number.NaN });
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe('Formato de paginação invalido');
    }
  });

  test('should throw an error if perPage is NAN', async () => {
    try {
      await coreOficina.list({ perPage: Number.NaN });
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe('Formato de paginação invalido');
    }
  });

  test('should throw an error page is set and perPage not', async () => {
    try {
      await coreOficina.list({ page: 1 });
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe(
        'Paginação necessita do quantidade por pagina',
      );
    }
  });

  test('should throw an error page is not set and perPage is', async () => {
    try {
      await coreOficina.list({ perPage: 1 });
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe('Paginação necessita do número da página');
    }
  });

  test('should return with all oficinas with pagination', async () => {
    const response = await coreOficina.list({ page: 1, perPage: 10 });

    expect(response.total).toBe(2);
    expect(response.totalPage).toBe(1);
    expect(response.items[0]).toMatchObject({
      nome: 'Oficina 1',
      cpf_cnpj: '02034282345',
      id_municipio: '230440',
      endereco: `rua chico mota ${id - 1}`,
    });
  });

  test('should return with all oficinas without pagination', async () => {
    const response = await coreOficina.list({});

    expect(response.total).toBe(2);
    expect(response.totalPage).toBe(1);
    expect(response.items[0]).toMatchObject({
      nome: 'Oficina 1',
      cpf_cnpj: '02034282345',
      id_municipio: '230440',
      endereco: `rua chico mota ${id - 1}`,
    });
  });

  test('should throw an error if query is set and fields not', async () => {
    try {
      await coreOficina.list({ query: 'rua chico' });
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe('Pesquisa necessita dos campos');
    }
  });

  test('should throw an error if query is not set and fields is', async () => {
    try {
      await coreOficina.list({ fields: ['oficinas.endereco'] });
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe('Pesquisa necessita do valor');
    }
  });

  test('should find oficinas by query', async () => {
    const response = await coreOficina.list({
      query: `rua chico mota ${id}`,
      fields: [
        'oficinas.endereco',
        'oficinas.nome',
        'oficinas.numero',
        'oficinas.endereco_complemento',
      ],
    });
    expect(response.total).toBe(1);
    expect(response.items[0]).toMatchObject({
      nome: `Oficina ${id}`,
      cpf_cnpj: '02034282345',
      id_municipio: '230440',
      endereco: `rua chico mota ${id}`,
    });
  });

  test('should throw an error if fieldsort is set and orderSort not', async () => {
    try {
      await coreOficina.list({ fieldSort: ['oficinas.nome'] });
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe(
        'Ordernação dos campos necessita saber a forma de ordenção',
      );
    }
  });

  test('should throw an error if fieldsort is not set and orderSort is', async () => {
    try {
      await coreOficina.list({ orderSort: ['desc'] });
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe(
        'Ordernação saber quais campos serão ordernados',
      );
    }
  });

  test('should throw an error on incompatible array length fieldsort and orderSort', async () => {
    try {
      await coreOficina.list({
        orderSort: ['desc'],
        fieldSort: [
          'oficinas.endereco',
          'oficinas.nome',
          'oficinas.numero',
          'oficinas.endereco_complemento',
        ],
      });
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe(
        'Quantidade de campos de ordenação e suas formas não são compativeis',
      );
    }
  });

  test('should return oficinas ordereed by name', async () => {
    const response = await coreOficina.list({
      orderSort: ['desc'],
      fieldSort: ['oficinas.nome'],
    });
    expect(response.total).toBe(2);
    expect(response.items[0]).toMatchObject({
      nome: `Oficina ${id}`,
      cpf_cnpj: '02034282345',
      id_municipio: '230440',
      endereco: `rua chico mota ${id}`,
    });
  });
});
