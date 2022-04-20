import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import Veiculo from './Veiculo';
import Identificador from './Identificador';

@Entity('veiculos_identificadores', { schema: 'sav2' })
class VeiculoIdenficador {
  @PrimaryGeneratedColumn()
  id_veiculo_idenficador: number;

  @Column()
  id_veiculo: number;

  @Column()
  id_identificador: number;

  @Column({ default: '1' })
  ativo: '0' | '1';

  @Column('date')
  data_identificador: Date;

  @Column()
  observacao: string;

  @ManyToOne(() => Veiculo)
  @JoinColumn({ name: 'id_veiculo' })
  veiculo: Veiculo;

  @ManyToOne(() => Identificador)
  @JoinColumn({ name: 'id_identificador' })
  identificador: Identificador;

  @Column()
  criado_por: string;

  @CreateDateColumn()
  criado_em: Date;
}

export default VeiculoIdenficador;
