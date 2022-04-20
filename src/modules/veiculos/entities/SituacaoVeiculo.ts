import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Veiculo from './Veiculo';
import SituacaoTipo from './SituacaoTipo';
import Km from './Km';

@Entity('situacoes_veiculos', { schema: 'sav2' })
class SituacaoVeiculo {
  @PrimaryGeneratedColumn()
  id_situacao_veiculo: number;

  @Column()
  id_veiculo: number;

  @Column()
  id_km: number;

  @Column()
  id_situacao_tipo: number;

  @Column()
  id_situacao_tipo_especificacao: number;

  @Column()
  observacao: string;

  @Column('date')
  data_situacao: Date;

  @Column()
  criado_por: string;

  @CreateDateColumn()
  criado_em: Date;

  @ManyToOne(() => Veiculo)
  @JoinColumn({ name: 'id_veiculo' })
  veiculo: Veiculo;

  @ManyToOne(() => SituacaoTipo)
  @JoinColumn({ name: 'id_situacao_tipo' })
  situacaoTipo: SituacaoTipo;

  @ManyToOne(() => Km)
  @JoinColumn({ name: 'id_km' })
  kmSituacao: Km;
}

export default SituacaoVeiculo;
