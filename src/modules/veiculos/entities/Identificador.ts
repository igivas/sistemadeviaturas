import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import VeiculoIdenficador from './VeiculoIdentificador';

@Entity('identificadores', { schema: 'sav2' })
class Identificador {
  @PrimaryGeneratedColumn()
  id_identificador: number;

  /* @Column()
  id_veiculo: number | null;

  @ManyToOne(() => Veiculo)
  @JoinColumn({ name: 'id_veiculo' })
  veiculo: Veiculo;
 */
  @Column()
  identificador: string;

  @Column()
  observacao: string;

  @Column()
  criado_por: string;

  @CreateDateColumn()
  criado_em: Date;

  @OneToMany(
    () => VeiculoIdenficador,
    veiculoIdenficador => veiculoIdenficador.id_identificador,
  )
  veiculos: VeiculoIdenficador[];
}

export default Identificador;
