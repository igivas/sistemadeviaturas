import Unidade from '@modules/public/entities/Unidade';
import {
  Column,
  Entity,
  PrimaryColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import GrupoUsuario from './GrupoUsuario';
import SistemaUsuario from './SistemaUsuario';

@Entity('usuarios', { schema: 'seg' })
class Usuario {
  @PrimaryColumn()
  usu_codigo: string;

  @Column()
  usu_nome: string;

  @Column()
  usu_nivel: 0 | 1 | 2;

  @Column()
  usu_senha: string;

  @Column()
  usu_email: string;

  @Column()
  usu_lotacao: string;

  @OneToMany(() => GrupoUsuario, grupoUsuario => grupoUsuario.usu_codigo)
  grupos_usuarios: GrupoUsuario[];

  @OneToMany(() => SistemaUsuario, sistemaUsuario => sistemaUsuario.usuario)
  sistemas_usuarios: SistemaUsuario[];

  @ManyToOne(() => Unidade)
  @JoinColumn({ name: 'usu_lotacao', referencedColumnName: 'pes_codigo' })
  unidade: Unidade;
}

export default Usuario;
