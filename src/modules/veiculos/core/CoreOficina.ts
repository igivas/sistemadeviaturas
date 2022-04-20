import { inject, injectable } from 'tsyringe';
import { getConnection } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';
import AppError from '../../../errors/AppError';
import Oficina from '../entities/Oficina';
import { IGetOficinas } from '../interfaces/request/IGetOficinas';
import {
  IDadosOficina,
  IPostOficina,
} from '../interfaces/request/IPostOficina';
import { IResponseOficinas } from '../interfaces/response/IResponseOficinas';
import IOficinasRepository from '../repositories/interfaces/IOficinasRepository';

@injectable()
class CoreOficina {
  constructor(
    @inject('OficinasRepository')
    private oficinasRepository: IOficinasRepository,
  ) {}

  async list({
    page,
    perPage,
    query,
    fields,
    fieldSort,
    orderSort,
  }: IGetOficinas): Promise<IResponseOficinas> {
    if (Number.isNaN(page)) throw new AppError('Formato de paginação invalido');
    if (Number.isNaN(perPage))
      throw new AppError('Formato de paginação invalido');

    if (page && !perPage)
      throw new AppError('Paginação necessita do quantidade por pagina');

    if (!page && perPage)
      throw new AppError('Paginação necessita do número da página');

    if (query && (!fields || fields.length < 1))
      throw new AppError('Pesquisa necessita dos campos');

    if (!query && fields && fields.length > 0)
      throw new AppError('Pesquisa necessita do valor');

    if (!!fieldSort && !orderSort)
      throw new AppError(
        'Ordernação dos campos necessita saber a forma de ordenção',
      );

    if (!fieldSort && !!orderSort)
      throw new AppError('Ordernação saber quais campos serão ordernados');

    if (fieldSort?.length !== orderSort?.length)
      throw new AppError(
        'Quantidade de campos de ordenação e suas formas não são compativeis',
      );

    let items: Oficina[];
    let total;
    let response;
    if (page && perPage) {
      [items, total] = await this.oficinasRepository.findOficinas(
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
      [items, total] = await this.oficinasRepository.findOficinas(
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
    } as IResponseOficinas;
  }

  async create({ criado_por, oficinas }: IPostOficina): Promise<Oficina[]> {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const oficinasFormated = await Promise.all(
        oficinas.map(
          async (oficina): Promise<IDadosOficina> => {
            const oficinaExist = await this.oficinasRepository.findByName(
              oficina.nome,
            );

            if (oficinaExist)
              throw new AppError(
                `A oficina '${oficina.nome}' já consta no banco`,
              );

            let oficinaMatriz;
            if (oficina.id_oficina_pai) {
              oficinaMatriz = await this.oficinasRepository.findById(
                oficina.id_oficina_pai,
              );

              if (!oficinaMatriz) throw new AppError('Matriz não encontrada');

              return {
                ...oficina,
                id_oficina_pai: oficinaMatriz?.id.toString(),
              };
            }

            return oficina;
          },
        ),
      );

      const oficinasCreated = await this.oficinasRepository.create(
        oficinasFormated.map(
          oficina =>
            ({
              ...oficina,
              id_oficina: uuidV4(),
              id_oficina_pai: oficina.id_oficina_pai
                ? Number.parseInt(oficina.id_oficina_pai, 10)
                : undefined,
              criado_por,
            } as Oficina),
        ),
        queryRunner,
      );

      queryRunner.commitTransaction();
      await queryRunner.release();
      return oficinasCreated;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      if (error instanceof AppError) throw error;

      throw new AppError(
        'Não pode inserir oficina. Por favor verifique os campos',
      );
    }
  }

  async listOficinaMatriz(): Promise<Oficina[]> {
    return this.oficinasRepository.listMatrizes();
  }
}

export default CoreOficina;
