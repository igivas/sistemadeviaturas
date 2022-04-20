import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('usuarios', { schema: 'seg' })
class Usuario {
  @PrimaryColumn()
  usu_codigo: string;

  @Column()
  usu_nome: string;

  @Column()
  usu_email: string;
}

export default Usuario;
