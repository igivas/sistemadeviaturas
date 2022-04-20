import Veiculo from '@modules/veiculos/entities/Veiculo';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';

@Entity('solicitacoes_pneus', { schema: 'sav2' })
class SolicitacaoPneu {
  @PrimaryGeneratedColumn()
  id_solicitacao_pneu: number;

  @ManyToOne(() => Veiculo)
  @JoinColumn({ name: 'id_veiculo' })
  id_veiculo: number;

  @Column()
  id_referencia_pneu: number;

  @Column()
  id_opm_solicitante: number;

  @Column()
  id_pm_solicitante: number;

  @Column()
  qtd_solicitada: number;

  @Column()
  ultimo_km: number;

  @Column({ nullable: true, length: 50 })
  justificativa: string;

  @Column({ nullable: true, length: 255 })
  justificativa_path: string;

  @Column({ nullable: true, length: 255 })
  solicitacao_path: string;

  @Column({ nullable: true, length: 255 })
  laudo_twi_path: string;

  @Column({ nullable: false })
  criado_por: string;

  @Column()
  criado_em: Date;
}

export default SolicitacaoPneu;
