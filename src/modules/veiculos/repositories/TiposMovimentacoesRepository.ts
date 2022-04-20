import { Repository, getRepository } from 'typeorm';
import TipoMovimentacao from '../entities/TipoMovimentacao';
import ITiposMovimentacoesRepository from './interfaces/ITiposMovimentacoesRepository';

class TiposMovimentacoesRepository implements ITiposMovimentacoesRepository {
  private readonly ormRepository: Repository<TipoMovimentacao>;

  constructor() {
    this.ormRepository = getRepository(TipoMovimentacao);
  }

  public async findAll(): Promise<TipoMovimentacao[]> {
    const response = await this.ormRepository.find();
    return response;
  }

  public async findOne(
    id_tipo_movimentacao: number,
  ): Promise<TipoMovimentacao | undefined> {
    const tipoMovimentacao = await this.ormRepository.findOne({
      where: { id_tipo_movimentacao },
    });
    return tipoMovimentacao;
  }
}

export default TiposMovimentacoesRepository;
