import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import Veiculo from './Veiculo';
import SituacaoVeiculo from './SituacaoVeiculo';

@Entity('kms', { schema: 'sav2' })
class Km {
  @PrimaryGeneratedColumn()
  id_km: number;

  @Column()
  id_veiculo: number;

  @ManyToOne(() => Veiculo)
  @JoinColumn({ name: 'id_veiculo' })
  veiculo: Veiculo;

  @Column()
  km_atual: number;

  @Column({ type: 'timestamp' })
  data_km: Date;

  @Column()
  criado_por: string;

  @CreateDateColumn()
  criado_em: Date;

  @OneToMany(
    () => SituacaoVeiculo,
    situacaoVeiculo => situacaoVeiculo.kmSituacao,
  )
  situacoesKms: SituacaoVeiculo[];
}

export default Km;
