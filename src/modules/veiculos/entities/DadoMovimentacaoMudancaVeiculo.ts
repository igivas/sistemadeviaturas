import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import Movimentacao from './Movimentacao';
import MovimentacaoTransferencia from './MovimentacaoTransferencia';
import MovimentacaoManutencao from './MovimentacaoManutencao';

@Entity('dados_movimentacoes_mudancas_veiculos', { schema: 'sav2' })
class DadoMovimentacaoMudancaVeiculo {
  @PrimaryGeneratedColumn()
  id_dado_movimentacao_mudanca: number;

  @Column()
  id_movimentacao: number;

  @Column()
  id_opm_origem: number;

  @Column()
  assinado_origem: '0' | '1';

  @Column()
  assinado_por: string;

  @Column()
  assinado_devolucao_origem: '0' | '1';

  @Column()
  assinado_devolucao_origem_por: string;

  @Column()
  autoridade_origem: string;

  @OneToOne(() => Movimentacao)
  @JoinColumn({ name: 'id_movimentacao' })
  movimentacao: Movimentacao;

  @OneToOne(
    () => MovimentacaoTransferencia,
    movimentacaoTransferencia =>
      movimentacaoTransferencia.dadoMovimentacaoMudanca,
  )
  movimentacaoTransferencia: MovimentacaoTransferencia;

  @OneToOne(
    () => MovimentacaoManutencao,
    movimentacaoManutencao => movimentacaoManutencao.dadoMovimentacaoMudanca,
  )
  movimentacaoManutencao: MovimentacaoManutencao;
}

export default DadoMovimentacaoMudancaVeiculo;
