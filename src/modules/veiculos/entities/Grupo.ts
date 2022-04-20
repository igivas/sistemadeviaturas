import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('grupos', { schema: 'sav2' })
class Grupo {
  @PrimaryGeneratedColumn('uuid')
  id_grupo: string;

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  grupo: string;

  @Column()
  criado_por: string;

  @Column()
  atualizado_por: string;

  @CreateDateColumn()
  criado_em: Date;

  @UpdateDateColumn()
  atualizado_em: Date;
}

export default Grupo;
