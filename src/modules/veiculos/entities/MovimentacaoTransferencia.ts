import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import DadoMovimentacaoMudancaVeiculo from './DadoMovimentacaoMudancaVeiculo';

@Entity('movimentacoes_transferencias', { schema: 'sav2' })
class MovimentacaoTransferencia {
  @PrimaryGeneratedColumn()
  id_movimentacao_transferencia: number;

  @Column()
  id_dado_movimentacao_mudanca: number;

  @Column()
  id_opm_destino: number;

  @Column()
  autoridade_destino: string;

  @Column()
  assinado_destino: '0' | '1';

  @Column()
  assinado_por: string;

  @Column()
  assinado_devolucao_destino: '0' | '1';

  @Column()
  assinado_devolucao_destino_por: string;

  @Column()
  justificativa: string;

  @OneToOne(() => DadoMovimentacaoMudancaVeiculo)
  @JoinColumn({ name: 'id_dado_movimentacao_mudanca' })
  dadoMovimentacaoMudanca: DadoMovimentacaoMudancaVeiculo;
}
export default MovimentacaoTransferencia;
