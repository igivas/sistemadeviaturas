import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('emails', { schema: 'sav2' })
class Email {
  @PrimaryGeneratedColumn('uuid')
  id_email: string;

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column({ name: 'is_active' })
  ativo: '0' | '1';

  @Column()
  criado_por: string;

  @Column()
  atualizado_por: string;

  @CreateDateColumn()
  criado_em: Date;

  @UpdateDateColumn()
  atualizado_em: Date;
}

export default Email;
