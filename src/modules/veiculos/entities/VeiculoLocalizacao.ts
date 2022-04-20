import {
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import Veiculo from './Veiculo';

@Entity('veiculos_localizacoes', { schema: 'sav2' })
class VeiculoLocalizacao {
  @PrimaryGeneratedColumn()
  id_localizacao: number;

  @Column()
  localizacao: string;

  @Column()
  id_veiculo: number;

  @Column()
  data_localizacao: Date;

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

  @ManyToOne(() => Veiculo)
  @JoinColumn({ name: 'id_veiculo' })
  veiculo: Veiculo;
}

export default VeiculoLocalizacao;
