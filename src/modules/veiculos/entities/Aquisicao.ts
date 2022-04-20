import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
  BeforeUpdate,
} from 'typeorm';
import Veiculo from './Veiculo';
import Orgao from './Orgao';
import { EFormaDeAquisicao, EOrigemDeAquisicao } from '../enums/EAquisicao';

@Entity('aquisicoes', { schema: 'sav2' })
class Aquisicao {
  @PrimaryGeneratedColumn()
  id_aquisicao: number;

  @Column()
  id_veiculo: number;

  @ManyToOne(() => Veiculo)
  @JoinColumn({ name: 'id_veiculo' })
  veiculo: Veiculo;

  //  0,  Orgânico
  //  1,  Locado
  //  2,  Cessão
  @Column({
    type: 'enum',
    enum: EOrigemDeAquisicao,
  })
  origem_aquisicao: EOrigemDeAquisicao;

  // 0,  Compra
  // 1, Doação
  @Column({ type: 'enum', enum: EFormaDeAquisicao })
  forma_aquisicao: EFormaDeAquisicao;

  @Column()
  valor_aquisicao: number;

  @Column()
  id_orgao_aquisicao: number;

  @Column('date')
  data_aquisicao: Date;

  @Column()
  doc_aquisicao: string;

  @Column()
  criado_por: string;

  @CreateDateColumn()
  criado_em: Date;

  @Column()
  atualizado_por: string;

  @UpdateDateColumn()
  atualizado_em: Date;

  @Column()
  file_path: string;

  @ManyToOne(() => Orgao)
  @JoinColumn({ name: 'id_orgao_aquisicao' })
  orgao_aquisicao: Orgao;

  @BeforeUpdate()
  updateAtualizadoEm? = (): void => {
    this.atualizado_em = new Date();
  };
}

export default Aquisicao;
