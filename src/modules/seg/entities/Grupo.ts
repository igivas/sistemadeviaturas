import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import GrupoUsuario from './GrupoUsuario';

@Entity('grupos', { schema: 'seg' })
class Grupo {
  @PrimaryGeneratedColumn()
  gru_codigo: number;

  @Column()
  sis_codigo: number;

  @Column()
  gru_nome: string;

  @OneToMany(() => GrupoUsuario, grupoUsuario => grupoUsuario.grupo)
  gruposUsuarios: GrupoUsuario[];
}

export default Grupo;
