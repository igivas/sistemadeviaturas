import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { EPrefixoTipo, EEmprego } from '../enums/EPrefixo';

import Veiculo from './Veiculo';

@Entity('prefixos', { schema: 'sav2' })
class Prefixo {
  @PrimaryGeneratedColumn()
  id_prefixo: number;

  @Column()
  id_veiculo: number;

  @ManyToOne(() => Veiculo)
  @JoinColumn({ name: 'id_veiculo' })
  veiculo: Veiculo;

  @Column({
    type: 'enum',
    enum: EPrefixoTipo,
  })
  prefixo_tipo: EPrefixoTipo;

  @Column({
    type: 'enum',
    enum: EEmprego,
  })
  emprego: EEmprego;

  @Column()
  prefixo_sequencia: string;

  /*  @Column('date')
  data_prefixo: string; */

  @Column()
  criado_por: string;

  @CreateDateColumn()
  criado_em: Date;
}

export default Prefixo;
