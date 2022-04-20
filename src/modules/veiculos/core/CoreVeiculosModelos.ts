import { orderBy } from 'lodash';
import { inject, injectable, singleton } from 'tsyringe';
import { getConnection } from 'typeorm';
import AppError from '../../../errors/AppError';
import Veiculo from '../entities/Veiculo';
import VeiculoMarca from '../entities/VeiculoMarca';
import VeiculoModelo from '../entities/VeiculoModelo';
import { IGetVeiculosModelos } from '../interfaces/request/IGetVeiculosModelos';
import {
  IDadosVeiculosModelos,
  IPostVeiculosModelos,
} from '../interfaces/request/IPostVeiculosModelos';
import { IPutModelos } from '../interfaces/request/IPutModelos';
import { IResponseVeiculosModelos } from '../interfaces/response/IResponseVeiculosModelos';
import IVeiculosEspeciesRepository from '../repositories/interfaces/IVeiculosEspeciesRepository';
import IVeiculosMarcasRepository from '../repositories/interfaces/IVeiculosMarcasRepository';
import IVeiculosModelosRepository from '../repositories/interfaces/IVeiculosModelosRepository';
import IVeiculosRepository from '../repositories/interfaces/IVeiculosRepository';

interface IResponse {
  total: number;
  totalPage: number;
  items: object[];
}

type IRequestShow = {
  page: number;
  perPage: number;
  query: string;
  opms: string;
  fields?: string[];
  id_veiculo_marca?: string;
  fieldSort?: string[];
  orderSort?: string[];
};

interface IRequestUpdate {
  id: string;
  body: IPutModelos;
  atualizado_por: string;
}

type IRequestList = {
  page: number;
  perPage: number;
  query: string;
  fields?: string[];
  opms: string;
  id_veiculo_marca?: string;
  id_veiculo_especie?: string;
  existCarga?: '1';
  fieldSort?: string[];
  orderSort?: string[];
};

@injectable()
@singleton()
class CoreVeiculosModelos {
  constructor(
    @inject('VeiculosRepository')
    private veiculosRepository: IVeiculosRepository,

    @inject('VeiculosModelosRepository')
    private veiculosModelosRepository: IVeiculosModelosRepository,

    @inject('VeiculosEspeciesRepository')
    private veiculosEspeciesRepository: IVeiculosEspeciesRepository,

    @inject('VeiculosMarcasRepository')
    private veiculosMarcasRepository: IVeiculosMarcasRepository,
  ) {
    /* eslint-disable-next-line prettier/prettier */
  }

  private getNumbersArray(values: string): number[] {
    if (!values.match(/^(?:-?\d+,)*-?\d+?$/gm))
      throw new AppError('Formato de valor inválido');
    return values.split(',').map(value => {
      const numberOpm = Number.parseInt(value, 10);
      if (Number.isNaN(numberOpm)) throw new AppError('opm inválido');
      return numberOpm;
    });
  }

  public async list({
    page,
    perPage,
    query,
    fields,
    fieldSort,
    orderSort,
  }: IGetVeiculosModelos): Promise<IResponseVeiculosModelos> {
    if (Number.isNaN(page)) throw new AppError('Formato de paginação inválido');

    if (Number.isNaN(perPage))
      throw new AppError('Formato de paginação inválido');

    if (page && !perPage)
      throw new AppError('Paginação necessita de quantidade por página');

    if (!page && perPage)
      throw new AppError('Paginação necessita do número da página');

    if (query && (!fields || fields.length < 1))
      throw new AppError('Pesquisa necessita dos campos');

    if (!query && fields && fields.length > 0)
      throw new AppError('Pesquisa necessita do valor');

    if (!!fieldSort && !orderSort)
      throw new AppError(
        'Ordenação dos campos necessita saber a forma de ordenação',
      );

    if (!fieldSort && !!orderSort)
      throw new AppError('Escolher campos que serão ordenados');

    if (fieldSort?.length !== orderSort?.length)
      throw new AppError(
        'Quantidade de campos de ordenação e suas formas não são compatíveis',
      );

    let items: VeiculoModelo[];
    let total;
    let response;
    if (page && perPage) {
      [items, total] = await this.veiculosModelosRepository.findVeiculosModelos(
        fields || [],
        orderSort || [],
        fieldSort || [],

        page,
        perPage,
        query,
      );

      response = {
        items,
        total,
      };
    } else {
      [items, total] = await this.veiculosModelosRepository.findVeiculosModelos(
        fields || [],
        orderSort || [],
        fieldSort || [],
        undefined,
        undefined,
        query,
      );

      response = {
        items,
        total,
      };
    }

    return {
      totalPage: perPage ? Math.ceil((total as number) / perPage) : 1,
      ...response,
    } as IResponseVeiculosModelos;
  }

  public async create({
    criado_por,
    veiculos_modelos,
  }: IPostVeiculosModelos): Promise<VeiculoModelo[]> {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const veiculosModelosFormated = await Promise.all(
        veiculos_modelos.map(
          async (veiculo_modelo): Promise<IDadosVeiculosModelos> => {
            const veiculoModeloExist =
              await this.veiculosModelosRepository.findByNome(
                veiculo_modelo.nome,
              );

            if (veiculoModeloExist)
              throw new AppError(
                `O veículo modelo '${veiculo_modelo.nome}' já consta no banco`,
              );

            return veiculo_modelo;
          },
        ),
      );

      const veiculosModelosCreated =
        await this.veiculosModelosRepository.create(
          veiculosModelosFormated.map(
            veiculo_modelo =>
              ({
                nome: veiculo_modelo.nome,
                id_veiculo_especie: veiculo_modelo.id_veiculo_especie,
                id_veiculo_marca: veiculo_modelo.id_veiculo_marca,
                criado_por,
              } as VeiculoModelo),
          ),
          queryRunner,
        );

      queryRunner.commitTransaction();
      await queryRunner.release();
      return veiculosModelosCreated;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      if (error instanceof AppError) throw error;
      // eslint-disable-next-line no-unreachable

      throw new AppError(
        'Veículo Modelo não pode ser inserido.Favor verificar os campos',
      );
    }
  }

  public async update({
    id,
    body,
    atualizado_por,
  }: IRequestUpdate): Promise<object | undefined> {
    const modeloExists = await this.veiculosModelosRepository.findById(id);
    if (!modeloExists) {
      throw new AppError('Modelo não existe!');
    }

    let result;
    const modeloFormated = { ...modeloExists };

    delete modeloFormated.veiculoEspecie;
    delete modeloFormated.veiculoMarca;
    try {
      const {
        nome,
        id_veiculo_marca,
        id_veiculo_especie,
        ...restUpdateModelo
      } = body;

      const modeloUpdate = await this.veiculosModelosRepository.update(
        modeloFormated,
        {
          ...restUpdateModelo,
          nome,
          id_veiculo_marca,
          id_veiculo_especie,

          atualizado_por,
        } as Partial<VeiculoModelo>,
      );
      result = modeloUpdate;
    } catch (error) {
      throw new AppError('Erro de acesso ao banco');
    }

    if (!result)
      throw new AppError('Modelo de veículo não pode ser atualizado');

    return result;
  }
  /*
  public async showModelos(
    opms: string,
    page?: string,
    perPage?: string,
  ): Promise<IResponse> {
    if (!page && !perPage && !!page && !!perPage)
      throw new AppError('Parâmetros de paginação inválidos');

    const opmsNumber = this.getNumbersArray(opms);

    let veiculoModelos;
    let total;
    let finalResult;

    if (page && perPage) {
      const pageNumber = Number.parseInt(page.toString(), 10);
      const perPageNumber = Number.parseInt(perPage.toString(), 10);

      if (Number.isNaN(pageNumber) || Number.isNaN(perPageNumber))
        throw new AppError('Valores inválidos de paginação');

      [
        veiculoModelos,
        total,
      ] = await this.veiculosModelosRepository.findAllVeiculosByOpms(
        opmsNumber,
        pageNumber,
        perPageNumber,
      );

      finalResult = {
        total,
        totalPage: Math.ceil(total / Number(perPage)),
      };
    } else {
      [
        veiculoModelos,
        total,
      ] = await this.veiculosModelosRepository.findAllVeiculosByOpms(
        opmsNumber,
      );

      finalResult = {
        total,
        totalPage: 1,
      };
    }

    const veiculos = veiculoModelos.map(veiculoModelo => ({
      id_veiculo_especie: veiculoModelo.veiculoEspecie.nome,
      id_veiculo_marca: veiculoModelo.veiculoMarca.nome,
      id_veiculo_modelo: veiculoModelo.id_veiculo_modelo,
      nome: veiculoModelo?.nome,
    }));

    console.log(veiculos);

    return { items: veiculos, ...finalResult };
  }
  */

  public async showModelos({
    page,
    perPage,
    query,
    fields,
    opms,
    existCarga,
    fieldSort,
    orderSort,
    ...rest
  }: IRequestList): Promise<IResponse | object[] | undefined> {
    const formatedOpms = opms ? this.getNumbersArray(opms) : [];

    if (orderSort && fieldSort) {
      if (!Array.isArray(orderSort))
        throw new AppError('O tipo de ordenação deve ser uma lista');
      if (!Array.isArray(fieldSort))
        throw new AppError('Campos de ordenação devem ser uma lista');
      if (orderSort.length !== fieldSort.length)
        throw new AppError(
          'Tipo de ordenação e campos de ordenação não devem possuir tamanhos diferentes',
        );
      const typesOrder = ['desc', 'asc', 'DESC', 'ASC'];

      orderSort.forEach(order => {
        if (!typesOrder.includes(order))
          throw new AppError('Formato inválido de tipo de ordenação');
      });
    }

    if (existCarga && existCarga !== '1')
      throw new AppError('Carga de veículos inconsistente');

    let modelos;
    let total;

    // eslint-disable-next-line prefer-const
    [modelos, total] = await this.veiculosModelosRepository.findMarcas(
      Number(page),
      Number(perPage),
      query,
      {
        opms: formatedOpms,
        existCarga,
        id_veiculo_marca: Number.parseInt(rest.id_veiculo_marca as string, 10),
        id_veiculo_especie: Number.parseInt(
          rest.id_veiculo_especie as string,
          10,
        ),
      },
      fields,
      fieldSort,
      orderSort,
    );

    modelos = await Promise.all(
      modelos.map(async modelo => {
        const {
          veiculoMarca,
          veiculoEspecie,

          veiculos,
          ...restModelo
        } = modelo;

        return {
          ...restModelo,
          opm: veiculos[0] ? veiculos[0].veiculoCarga.opm_carga : undefined,

          marca: veiculoMarca.nome,
          especie: veiculoEspecie.nome,
        };
      }),
    );

    return {
      total: total as number,
      totalPage: Math.ceil((total as number) / Number(perPage)),
      items: orderBy(modelos),
    };
  }

  public async showMarcas(opms: string): Promise<any> {
    const formatedOpms = this.getNumbersArray(opms);
    const marcas = await this.veiculosModelosRepository.findAllMarcas(
      formatedOpms,
    );
    return marcas.reduce((marcasFormated, marca) => {
      if (marcasFormated.includes(marca.id_veiculo_marca))
        return [...marcasFormated];
      return [...marcasFormated, marca.id_veiculo_marca];
    }, [] as string[]);
  }
}

export default CoreVeiculosModelos;
