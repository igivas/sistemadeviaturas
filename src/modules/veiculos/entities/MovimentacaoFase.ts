import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import Movimentacao from './Movimentacao';
import Fases from './Fases';
import EFase from '../enums/EFase';

@Entity('movimentacoes_fases', { schema: 'sav2' })
class MovimentacaoFase {
  @PrimaryGeneratedColumn()
  id_movimentacao_fase: number;

  @Column()
  id_movimentacao: number;

  @Column({
    type: 'enum',
    enum: EFase,
  })
  id_tipo_fase: EFase;

  @Column({
    type: 'enum',
    enum: EFase,
  })
  id_next_tipo_fase: EFase;

  @Column()
  obs: string;

  @Column({ nullable: false })
  criado_por: string;

  @Column()
  criado_em: Date;

  @ManyToOne(() => Movimentacao)
  @JoinColumn({ name: 'id_movimentacao' })
  movimentacao: Movimentacao;

  @ManyToOne(() => Fases)
  @JoinColumn({ name: 'id_tipo_fase' })
  tipoMovimentacaoFase: Fases;

  @ManyToOne(() => Fases)
  @JoinColumn({ name: 'id_next_tipo_fase' })
  nextTipoMovimentacaoFase: Fases;
}

export default MovimentacaoFase;
