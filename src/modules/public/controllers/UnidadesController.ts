import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListUnidadesUsuarioService from '../services/ListUnidadesUsuarioService';
import ListSubUnidadesByIdUnidadeService from '../services/ListSubUnidadesByIdUnidade';

export default class UnidadesController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { query, opm_usuario, page, perPage, sub_unidades } = request.query;
    const { id_usuario } = request.user;
    const listService = container.resolve(ListUnidadesUsuarioService);
    const listSubUnidadesByIdUnidadeService = container.resolve(
      ListSubUnidadesByIdUnidadeService,
    );

    let unidades;
    if (query)
      unidades = await listService.execute(
        query ? String(query) : undefined,
        String(id_usuario),
        opm_usuario ? Number(opm_usuario) : undefined,
        page?.toString(),
        perPage?.toString(),
      );
    else if (sub_unidades && sub_unidades === '1' && opm_usuario) {
      unidades = await listSubUnidadesByIdUnidadeService.execute(
        opm_usuario?.toString() || '',
      );
    }

    return response.json(unidades);
  }
}
