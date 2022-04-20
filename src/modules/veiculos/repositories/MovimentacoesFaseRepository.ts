import { Repository, getRepository, QueryRunner } from 'typeorm';
import IMovimentacoesFasesRepository from './interfaces/IMovimentacoesFasesRepository';
import MovimentacaoFase from '../entities/MovimentacaoFase';

class MovimentacoesFasesRepository implements IMovimentacoesFasesRepository {
  private readonly ormRepository: Repository<MovimentacaoFase>;

  constructor() {
    this.ormRepository = getRepository(MovimentacaoFase);
  }

  public async findAllByIdOpm(id_opm: string): Promise<MovimentacaoFase[]> {
    const movimentacoesFase = await this.ormRepository.find({
      relations: ['movimentacao'],
      where: {
        movimentacao: {
          id_opm_destino: Number(id_opm),
        },
      },
    });

    return movimentacoesFase;
  }

  findByVeiculoId(
    id: number,
    page?: number | undefined,
    perPage?: number | undefined,
  ): Promise<{
    total: number;
    totalPage: number;
    movimentacoes: MovimentacaoFase[];
  }> {
    throw new Error('Method not implemented.');
  }

  public async findLastMovimentacaoByIdMovimentacao(
    id_movimentacao: number,
  ): Promise<MovimentacaoFase | undefined> {
    const actiVeMovimentacao = await this.ormRepository.findOne({
      where: {
        id_movimentacao,
      },
      order: {
        id_movimentacao_fase: 'DESC',
      },
    });

    return actiVeMovimentacao;
  }

  public async create(
    movimentacaoFaseData: MovimentacaoFase,
    queryRunner?: QueryRunner,
  ): Promise<MovimentacaoFase> {
    const movimentacaoFase = queryRunner
      ? queryRunner.manager.create(MovimentacaoFase, movimentacaoFaseData)
      : this.ormRepository.create(movimentacaoFaseData);

    return queryRunner
      ? queryRunner.manager.save(movimentacaoFase)
      : this.ormRepository.save(movimentacaoFase);
  }

  public async update(
    oldValue: MovimentacaoFase,
    newData: object,
  ): Promise<MovimentacaoFase | undefined> {
    throw new Error('Method not implemented.');
  }
}

export default MovimentacoesFasesRepository;
