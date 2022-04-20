import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import Unidade from '@modules/public/entities/Unidade';
import Veiculo from './Veiculo';

@Entity('veiculos_carga_transferência', { schema: 'sav2' })
class VeiculoCargaTransferencia {
  @PrimaryGeneratedColumn()
  id_carga: number;

  @Column()
  id_veiculo: number;

  @Column()
  opm_carga: number;

  @Column()
  opm_carga_sigla: string;

  @Column()
  data_carga: string;

  @Column()
  criado_por: string;

  @Column()
  atualizado_por: string;

  @UpdateDateColumn()
  atualizado_em: Date;

  @Column()
  opm_carga_lob: string;

  @CreateDateColumn()
  criado_em: Date;

  @OneToOne(() => Veiculo)
  @JoinColumn({ name: 'id_veiculo' })
  veiculo: Veiculo;

  @OneToOne(() => Unidade)
  @JoinColumn({ name: 'opm_carga' })
  unidade: Unidade;
}

export default VeiculoCargaTransferencia;
