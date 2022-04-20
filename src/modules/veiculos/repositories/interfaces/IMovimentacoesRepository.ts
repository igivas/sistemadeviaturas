import Movimentacao from '@modules/veiculos/entities/Movimentacao';

import ETipoMovimentacao from '@modules/veiculos/enums/ETipoMovimentacao';
import EFase from '@modules/veiculos/enums/EFase';
import { DeleteResult } from 'typeorm';
import { IDefaultRepository } from './IDefaultRepository';

export type IMovimentacoesSearch = {
  opms: number[];
  tipoMovimentacao?: ETipoMovimentacao;
  fase?: EFase;
  pendingSignature?: '0' | '1';
};

export default interface IMovimentacoesRepository
  extends IDefaultRepository<Movimentacao> {
  findLastMovimentacaoByIdVeiculo(id_veiculo: number): Promise<Movimentacao>;
  findAllByIdVeiculo(
    id_veiculo: number,
    page?: number,
    perPage?: number,
  ): Promise<[Movimentacao[], number]>;

  findById(
    id_movimentacao: number,
    hasRelation?: Array<keyof Movimentacao>,
  ): Promise<Movimentacao>;

  findAllByIdFases(id_movimentacao: number): Promise<Movimentacao>;

  findMovimentacaoBeforeOrEqualDataMovimentacao(
    data_movimentacao: Date,
    id_veiculo: number,
  ): Promise<Movimentacao | undefined>;

  findMovimentacaoAfterDataMovimentacao(
    data_movimentacao: Date,
    id_veiculo: number,
  ): Promise<Movimentacao | undefined>;

  findMovimentacoes(
    page: number,
    perPage: number,
    movimentacoes: IMovimentacoesSearch,
    fields?: string[],
    query?: string,
    fieldSort?: string[],
    orderSort?: string[],
  ): Promise<[Movimentacao[], number]>;

  findVeiculoCarga(
    id_veiculo: number,
    data_movimentacao?: Date,
  ): Promise<Movimentacao | undefined>;

  delete(id: number): Promise<DeleteResult>;
}
