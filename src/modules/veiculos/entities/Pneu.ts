import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import VeiculoEspecie from './VeiculoEspecie';
import VeiculoPneu from './VeiculoPneu';

@Entity('referencia_pneus', { schema: 'sav2' })
class Pneu {
  @PrimaryGeneratedColumn({ name: 'id_referencia_pneu' })
  id_pneu: number;

  @Column({ name: 'descricao' })
  referencia: string;

  @Column()
  id_veiculo_especie: number;

  /*   RAIO (TEXTO)

  MARCA (TEXTO)

  ESTOQUE (NUMERO)

  ATUALIZADO_POR (POLICIAL)

  ATUALIZADO_EM (DATA) */

  @Column()
  criado_por: string;

  @CreateDateColumn()
  criado_em: Date;

  @OneToMany(() => VeiculoPneu, veiculoPneu => veiculoPneu.id_referencia_pneu)
  veiculosPneus: VeiculoPneu[];

  @ManyToOne(() => VeiculoEspecie)
  @JoinColumn({ name: 'id_veiculo_especie' })
  veiculoEspecie: VeiculoEspecie;
}

export default Pneu;
