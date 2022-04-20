import { Repository, getRepository, QueryRunner } from 'typeorm';
import IMovimentacoesTransferenciasRepository from './interfaces/IMovimentacoesTransferenciasRepository';
import MovimentacaoTransferencia from '../entities/MovimentacaoTransferencia';

class MovimentacoesTransferenciaRepository
  implements IMovimentacoesTransferenciasRepository {
  private ormRepository: Repository<MovimentacaoTransferencia>;

  constructor() {
    this.ormRepository = getRepository(MovimentacaoTransferencia);
  }

  findByIdDadoMovimentacaoMudancaVeiculo(
    id_dado_movimentacao_mudanca: number,
  ): Promise<MovimentacaoTransferencia> {
    return this.ormRepository.findOneOrFail({
      where: {
        id_dado_movimentacao_mudanca,
      },
    });
  }

  create(
    data: MovimentacaoTransferencia,
    queryRunner?: QueryRunner,
  ): Promise<MovimentacaoTransferencia> {
    const movimentacaoTransferencia = queryRunner
      ? queryRunner.manager.create(MovimentacaoTransferencia, data)
      : this.ormRepository.create(data);

    return queryRunner
      ? queryRunner.manager.save(movimentacaoTransferencia)
      : this.ormRepository.save(movimentacaoTransferencia);
  }

  update(
    oldValue: MovimentacaoTransferencia,
    newData: MovimentacaoTransferencia,
    queryRunner?: QueryRunner,
  ): Promise<MovimentacaoTransferencia | undefined> {
    const movimentacaoTransferenciaUpdated = queryRunner
      ? queryRunner.manager.merge(MovimentacaoTransferencia, newData, newData)
      : this.ormRepository.merge(oldValue, newData);

    return queryRunner
      ? queryRunner.manager.save(
          MovimentacaoTransferencia,
          movimentacaoTransferenciaUpdated,
        )
      : this.ormRepository.save(movimentacaoTransferenciaUpdated);
  }
}

export default MovimentacoesTransferenciaRepository;
