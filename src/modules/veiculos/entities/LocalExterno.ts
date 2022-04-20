import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('locais_externos', { schema: 'sav2' })
class LocalExterno {
  @PrimaryGeneratedColumn()
  id_local_externo: number;

  @Column()
  descricao: string;

  @Column()
  tipo_local: string;

  @Column()
  criado_por: string;

  @CreateDateColumn()
  criado_em: Date;
}

export default LocalExterno;
