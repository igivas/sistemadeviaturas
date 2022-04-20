import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
  BeforeUpdate,
} from 'typeorm';
import Veiculo from './Veiculo';
import Pneu from './Pneu';

@Entity('veiculos_pneus', { schema: 'sav2' })
class VeiculoPneu {
  @PrimaryGeneratedColumn()
  id_veiculos_pneus: number;

  @Column()
  id_veiculo: number;

  @Column()
  id_referencia_pneu: number;

  @Column()
  criado_por: string;

  @CreateDateColumn()
  criado_em: Date;

  @Column()
  atualizado_por: string;

  @UpdateDateColumn()
  atualizado_em: Date;

  @ManyToOne(() => Veiculo, veiculo => veiculo.referenciasPneus)
  @JoinColumn({ name: 'id_veiculo' })
  veiculo: Veiculo;

  @ManyToOne(() => Pneu, pneu => pneu.veiculosPneus)
  @JoinColumn({ name: 'id_referencia_pneu' })
  pneu: Pneu;

  @BeforeUpdate()
  updateAtualizadoEm? = (): void => {
    this.atualizado_em = new Date();
  };
}

export default VeiculoPneu;
