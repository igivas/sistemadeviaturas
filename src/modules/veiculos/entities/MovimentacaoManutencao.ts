import {
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import DadoMovimentacaoMudancaVeiculo from './DadoMovimentacaoMudancaVeiculo';

@Entity('movimentacoes_manutencoes', { schema: 'sav2' })
class MovimentacaoManutencao {
  @PrimaryGeneratedColumn('uuid')
  id_manutencao: string;

  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  id_dado_movimentacao_mudanca: number;

  @Column()
  criado_por: string;

  @CreateDateColumn()
  criado_em: Date;

  @Column()
  atualizado_por: string;

  @UpdateDateColumn()
  atualizado_em: Date;

  @BeforeUpdate()
  updateAtualizadoEm? = (): void => {
    this.atualizado_em = new Date();
  };

  @OneToOne(() => DadoMovimentacaoMudancaVeiculo)
  @JoinColumn({ name: 'id_dado_movimentacao_mudanca' })
  dadoMovimentacaoMudanca: DadoMovimentacaoMudancaVeiculo;
}

export default MovimentacaoManutencao;
