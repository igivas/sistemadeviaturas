import { getRepository, QueryRunner, Repository } from 'typeorm';
import MovimentacaoManutencao from '../entities/MovimentacaoManutencao';
import { IMovimentacoesManutencoesRepository } from './interfaces/IMovimentacoesManutencoesRepository';

class MovimentacoesManutencoesRepository
  implements IMovimentacoesManutencoesRepository {
  private ormRepository: Repository<MovimentacaoManutencao>;

  constructor() {
    this.ormRepository = getRepository(MovimentacaoManutencao);
  }

  async findByIdDadoMovimentacaoMudanca(
    id: number,
  ): Promise<MovimentacaoManutencao | undefined> {
    return this.ormRepository.findOne({
      where: {
        id_dado_movimentacao_mudanca: id,
      },
      join: {
        alias: 'movimentacoesManutencao',
        innerJoinAndSelect: {
          manutencoesVeiculosLocalizacoes:
            'movimentacoesManutencao.manutencoesVeiculosLocalizacoes',
          oficina: 'manutencoesVeiculosLocalizacoes.oficina',
        },
      },
    });
  }

  async create(
    data: MovimentacaoManutencao,
    queryRunner?: QueryRunner,
  ): Promise<MovimentacaoManutencao> {
    const manutencao = queryRunner
      ? queryRunner.manager.create(MovimentacaoManutencao, data)
      : this.ormRepository.create(data);

    return queryRunner
      ? queryRunner.manager.save(manutencao)
      : this.ormRepository.save(manutencao);
  }

  async update(
    oldValue: MovimentacaoManutencao,
    newData: Partial<MovimentacaoManutencao>,
    queryRunner?: QueryRunner,
  ): Promise<MovimentacaoManutencao | undefined> {
    throw new Error('Method not implemented.');
  }
}

export default MovimentacoesManutencoesRepository;
