import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import EPerfisUsuarios from '../enums/EPerfisUsuarios';
import Grupo from './Grupo';

@Entity('grupos_usuarios', { schema: 'seg' })
class GrupoUsuario {
  @PrimaryColumn()
  usu_codigo: string;

  @PrimaryColumn({
    type: 'enum',
    enum: EPerfisUsuarios,
  })
  gru_codigo: EPerfisUsuarios[];

  @ManyToOne(() => Grupo, grupo => grupo.gruposUsuarios)
  @JoinColumn({ name: 'gru_codigo' })
  grupo: Grupo;
}

export default GrupoUsuario;
