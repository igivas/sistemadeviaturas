import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import Movimentacao from './Movimentacao';

@Entity('tipos_movimentacoes', { schema: 'sav2' })
class TipoMovimentacao {
  @PrimaryGeneratedColumn()
  id_tipo_movimentacao: number;

  @Column()
  tipo_movimentacao: string;

  @Column({ nullable: false })
  criado_por: string;

  @Column()
  criado_em: Date;

  @OneToMany(() => Movimentacao, movimentacao => movimentacao.tipoMovimentacao)
  movimentacoes: Movimentacao[];
}
export default TipoMovimentacao;
