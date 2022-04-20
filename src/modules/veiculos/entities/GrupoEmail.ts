import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import Email from './Email';
import Grupo from './Grupo';

@Entity('grupos_emails', { schema: 'sav2' })
class GrupoEmail {
  @PrimaryGeneratedColumn('uuid')
  id_grupo_email: string;

  @Column()
  id_grupo: number;

  @Column()
  id_email: number;

  @ManyToOne(() => Grupo)
  @JoinColumn({ name: 'id_grupo' })
  grupo: Grupo;

  @ManyToOne(() => Email)
  @JoinColumn({ name: 'id_email' })
  email: Email;

  @Column()
  criado_por: string;

  @Column()
  atualizado_por: string;

  @CreateDateColumn()
  criado_em: Date;

  @UpdateDateColumn()
  atualizado_em: Date;
}

export default GrupoEmail;
