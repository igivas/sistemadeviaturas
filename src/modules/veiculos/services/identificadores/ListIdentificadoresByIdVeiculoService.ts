import { injectable, inject } from 'tsyringe';
import { IVeiculosIdentificadoresRepository } from '@modules/veiculos/repositories/interfaces/IVeiculosIdentificadoresRepository';
import AppError from '../../../../errors/AppError';

interface IRequest {
  page: string;
  perPage: string;
}

interface IResponse {
  total: number;
  totalPage: number;
  items: object[];
}

@injectable()
class ListIdentificadoresByIdVeiculoService {
  constructor(
    @inject('VeiculosIdentificadoresRepository')
    private veiculosIdentificadoresRepository: IVeiculosIdentificadoresRepository,
  ) {}

  async execute({ page, perPage }: IRequest, id: string): Promise<IResponse> {
    const id_veiculo = Number.parseInt(id, 10);
    const pageNumber = Number.parseInt(page, 10);
    const perPageNumber = Number.parseInt(perPage, 10);

    if (Number.isNaN(id_veiculo)) throw new AppError('Veiculo inválido');

    if (
      !!page &&
      !Number.isNaN(pageNumber) &&
      !!perPage &&
      !Number.isNaN(perPageNumber)
    ) {
      throw new AppError('Parametros de pesquisa inválidos');
    }

    const [
      veiculosIdenTificadores,
      total,
    ] = await this.veiculosIdentificadoresRepository.findAllByIdVeiculo(
      id_veiculo,
      pageNumber,
      perPageNumber,
    );

    return {
      total,
      totalPage: Math.ceil(total / perPageNumber) || 0,
      items: veiculosIdenTificadores.map(veiculoIdentificador => ({
        id_veiculo_identificador: veiculoIdentificador.id_veiculo_idenficador,
        ativo: veiculoIdentificador.ativo,
        ...veiculoIdentificador.identificador,
        data_identificador: veiculoIdentificador.data_identificador,
        observacao: veiculoIdentificador.observacao,
      })),
    };
  }
}

export default ListIdentificadoresByIdVeiculoService;
