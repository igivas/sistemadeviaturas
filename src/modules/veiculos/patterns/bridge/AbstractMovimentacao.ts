import { IHandleMovimentacao } from '@modules/veiculos/interfaces/patterns/bridge/IHandleMovimentacao';
import MovimentacaoFase from '@modules/veiculos/entities/MovimentacaoFase';
import { QueryRunner, getConnection } from 'typeorm';
import {
  IPostMovimentacaoByFile,
  IDefaultMovimentacao,
  IPostMovimentacao,
} from '@modules/veiculos/interfaces/request/IPostMovimentacao';
import { IPostMovimentacaoManutencao } from '@modules/veiculos/interfaces/request/IPostMovimentacaoManutencao';

class AbstractMovimentacao {
  protected movimentacao: IHandleMovimentacao;

  protected queryRunner: QueryRunner;

  constructor(movimentacao: IHandleMovimentacao) {
    this.movimentacao = movimentacao;
    const connection = getConnection();
    this.queryRunner = connection.createQueryRunner();
  }

  async handleMovimentacao(
    values: (
      | IPostMovimentacao
      | IPostMovimentacaoByFile
      | IPostMovimentacaoManutencao
    ) &
      Omit<IDefaultMovimentacao, 'movimentacao' | 'manutencao'> & {
        id_veiculo: number;
      },
    movimentacao_file?: Express.Multer.File,
  ): Promise<MovimentacaoFase & { url_documento_sga?: string }> {
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();

    try {
      if (movimentacao_file)
        return this.movimentacao.handleMovimentacaoWithFile(
          { ...values, movimentacao_file } as IPostMovimentacaoByFile & {
            id_veiculo: number;
          },
          this.queryRunner,
        );

      return this.movimentacao.handleMovimentacao(values, this.queryRunner);
    } catch (error) {
      await this.queryRunner.rollbackTransaction();
      await this.queryRunner.release();
      throw error;
    }
  }

  async showMovimentacao(id: number): Promise<any> {
    return this.movimentacao.showMovimentacao(id);
  }
}

export default AbstractMovimentacao;
