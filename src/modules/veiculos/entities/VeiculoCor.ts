import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('veiculos_cores', { schema: 'sav2' })
class VeiculoCor {
  @PrimaryGeneratedColumn()
  id_cor: number;

  @Column()
  nome: string;

  @Column()
  criado_por: string;

  @Column()
  atualizado_por: string;

  @CreateDateColumn()
  criado_em: Date;

  @UpdateDateColumn()
  atualizado_em: Date;
}

export default VeiculoCor;
