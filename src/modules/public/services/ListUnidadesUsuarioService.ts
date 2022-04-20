import { injectable, inject } from 'tsyringe';
import AppError from '../../../errors/AppError';
import IUnidadesRepository from '../repositories/interfaces/IUnidadesRepository';
import IUsuariosUnidadesRepository from '../repositories/interfaces/IUsuariosUnidadesRepository';
import unidadesView from '../../../views/unidades_view';

@injectable()
class ListUnidadesUsuarioService {
  constructor(
    @inject('UnidadesRepository')
    private unidadesRepository: IUnidadesRepository,

    @inject('UsuariosUnidadesRepository')
    private unidadesUsuariosRepository: IUsuariosUnidadesRepository,
  ) {}

  public async execute(
    query: string | undefined,
    pes_codigo: string,
    opm_usuario?: number,
    page?: string,
    perPage?: string,
  ): Promise<object> {
    if ((!!page && !perPage) || (!page && !!perPage))
      throw new AppError('Parametros de paginacao inválidos');

    let unidades;
    let total;
    let finalResult;
    let formatedIds;

    if (opm_usuario) {
      const ids = await this.unidadesUsuariosRepository.findIdsUnidadesByPesCodigo(
        pes_codigo,
      );

      formatedIds =
        opm_usuario && !Number.isNaN(opm_usuario)
          ? [...ids, opm_usuario]
          : [...ids];
    }

    if (page && perPage) {
      const pageNumber = Number.parseInt(page, 10);
      const perPageNumber = Number.parseInt(perPage, 10);
      [unidades, total] = await this.unidadesRepository.findUnidades(
        query,
        formatedIds,
        pageNumber,
        perPageNumber,
      );
      finalResult = {
        total,
        totalPage: Math.ceil(total / Number(perPage)),
      };
    } else if (!page && !perPage) {
      [unidades, total] = await this.unidadesRepository.findUnidades(
        query,
        formatedIds,
      );
      finalResult = {
        total,
        totalPage: 1,
      };
    }

    const formatedUnidades =
      unidades && unidades.length > 0 ? unidadesView.renderMany(unidades) : [];

    return {
      ...finalResult,
      items: formatedUnidades,
    };
  }
}

export default ListUnidadesUsuarioService;
