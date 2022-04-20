import { Repository, getRepository, QueryRunner } from 'typeorm';
import IDadosMovimentacoesMudancasVeiculosRepository from './interfaces/IDadosMovimentacoesMudancasVeiculosRepository';
import DadoMovimentacaoMudancaVeiculo from '../entities/DadoMovimentacaoMudancaVeiculo';

class DadosMovimentacoesMudancasVeiculosRepository
  implements IDadosMovimentacoesMudancasVeiculosRepository {
  private ormRepository: Repository<DadoMovimentacaoMudancaVeiculo>;

  constructor() {
    this.ormRepository = getRepository(DadoMovimentacaoMudancaVeiculo);
  }

  async findByIdMovimentacao(
    id_movimentacao: number,
  ): Promise<DadoMovimentacaoMudancaVeiculo> {
    return this.ormRepository.findOneOrFail({
      where: { id_movimentacao },
    });
  }

  create(
    data: DadoMovimentacaoMudancaVeiculo,
    queryRunner?: QueryRunner,
  ): Promise<DadoMovimentacaoMudancaVeiculo> {
    const dadoMovimentacaoMudancaVeiculo = queryRunner
      ? queryRunner.manager.create(DadoMovimentacaoMudancaVeiculo, data)
      : this.ormRepository.create(data);

    return queryRunner
      ? queryRunner.manager.save(dadoMovimentacaoMudancaVeiculo)
      : this.ormRepository.save(dadoMovimentacaoMudancaVeiculo);
  }

  update(
    oldValue: DadoMovimentacaoMudancaVeiculo,
    newData: object,
    queryRunner?: QueryRunner,
  ): Promise<DadoMovimentacaoMudancaVeiculo | undefined> {
    const aquisicaoUpdated = queryRunner
      ? queryRunner.manager.merge(
          DadoMovimentacaoMudancaVeiculo,
          oldValue,
          newData,
        )
      : this.ormRepository.merge(oldValue, newData);

    return queryRunner
      ? queryRunner.manager.save(
          DadoMovimentacaoMudancaVeiculo,
          aquisicaoUpdated,
        )
      : this.ormRepository.save(aquisicaoUpdated);
  }
}

export default DadosMovimentacoesMudancasVeiculosRepository;
