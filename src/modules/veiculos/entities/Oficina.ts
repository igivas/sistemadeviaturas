import Municipio from '@modules/public/entities/Municipio';
import {
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('oficinas', { schema: 'sav2' })
class Oficina {
  @PrimaryColumn('uuid')
  id_oficina: string;

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column()
  id_oficina_pai: number;

  @Column()
  cpf_cnpj: string;

  @Column()
  id_municipio: string;

  @Column()
  ativo: '0' | '1';

  @Column()
  cep: string;

  @Column()
  endereco: string;

  @Column()
  numero: string;

  @Column()
  endereco_complemento: string;

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

  @ManyToOne(() => Municipio)
  @JoinColumn({ name: 'id_municipio' })
  municipio: Municipio;

  @ManyToOne(() => Oficina, oficina => oficina.children)
  @JoinColumn({ name: 'id_oficina_pai' })
  parent: Oficina;

  @OneToMany(() => Oficina, oficina => oficina.parent)
  children: Oficina[];
}

export default Oficina;
