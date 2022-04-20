import {
  Entity,
  PrimaryGeneratedColumn,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeUpdate,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import MovimentacaoManutencao from './MovimentacaoManutencao';
import Oficina from './Oficina';

@Entity('manutencoes_oficinas', { schema: 'sav2' })
class ManutencaoOficina {
  @PrimaryGeneratedColumn('uuid')
  id_manutencao_localizacao: string;

  @PrimaryColumn('int')
  id: number;

  @Column()
  id_manutencao: number;

  @Column()
  id_oficina: number;

  @Column()
  data_manutencao_oficina: string;

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

  @ManyToOne(() => MovimentacaoManutencao)
  @JoinColumn({ name: 'id_manutencao' })
  veiculo: MovimentacaoManutencao;

  @ManyToOne(() => Oficina)
  @JoinColumn({ name: 'id_oficina' })
  movimentacaoManutencao: Oficina;
}

export default ManutencaoOficina;
