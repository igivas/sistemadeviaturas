import { Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import Unidade from './Unidade';

@Entity('usuarios_unidade', { schema: 'public' })
class UsuarioUnidade {
  @PrimaryColumn()
  usu_codigo: string;

  @PrimaryColumn()
  uni_codigo: number;

  @PrimaryColumn()
  sis_codigo: number;

  @OneToOne(() => Unidade)
  @JoinColumn({ name: 'uni_codigo' })
  unidade: Unidade;
}

export default UsuarioUnidade;
