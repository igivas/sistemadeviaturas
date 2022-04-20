import MovimentacaoFase from '@modules/veiculos/entities/MovimentacaoFase';
import { QueryRunner } from 'typeorm';
import {
  IPostMovimentacao,
  IPostMovimentacaoByFile,
} from '../../request/IPostMovimentacao';
import { IPostMovimentacaoManutencao } from '../../request/IPostMovimentacaoManutencao';
import { IPostMovimentacaoEmprestimo } from '../../request/IPostMovimentacaoEmprestimo';

export type IHandleMovimentacao = {
  handleMovimentacao(
    values:
      | (IPostMovimentacao & { id_veiculo: number })
      | IPostMovimentacaoManutencao
      | IPostMovimentacaoEmprestimo,
    queryRunner: QueryRunner,
  ): Promise<MovimentacaoFase>;

  showMovimentacao(id: number): Promise<any>;

  handleMovimentacaoWithFile(
    values: IPostMovimentacaoByFile & { id_veiculo: number },
    queryRunner: QueryRunner,
  ): Promise<MovimentacaoFase>;
};
