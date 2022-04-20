import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('graduacao', { schema: 'public' })
class Graduacao {
  @PrimaryGeneratedColumn()
  gra_codigo: number;

  @Column()
  gra_nome: string;

  @Column()
  gra_sigla: string;
}

export default Graduacao;
