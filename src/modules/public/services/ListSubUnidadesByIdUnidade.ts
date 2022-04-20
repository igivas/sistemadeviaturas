import { injectable, inject } from 'tsyringe';
import UnidadeDTOResponse from '@modules/veiculos/dto/Response/UnidadeDTOResponse';
import AppError from '../../../errors/AppError';
import unidades_view from '../../../views/unidades_view';
import IUnidadesRepository from '../repositories/interfaces/IUnidadesRepository';

@injectable()
class ListSubUnidadesByIdUnidadeService {
  constructor(
    @inject('UnidadesRepository')
    private unidadesRepository: IUnidadesRepository,
  ) {}

  async execute(opm: string): Promise<UnidadeDTOResponse[] | undefined> {
    const id_opm = Number.parseInt(opm, 10);

    if (Number.isNaN(id_opm)) throw new AppError('Opm inválida');

    if (id_opm === -1) return undefined;

    const subUnidades = await this.unidadesRepository.findSubunidades(id_opm);

    const subUnidadesFormated = unidades_view.renderMany(subUnidades);

    return subUnidadesFormated;
  }
}

export default ListSubUnidadesByIdUnidadeService;
