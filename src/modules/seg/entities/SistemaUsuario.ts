import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import Sistema from './Sistema';
import Usuario from './Usuario';

@Entity('sistemas_usuarios', { schema: 'seg' })
class SistemaUsuario {
  @PrimaryGeneratedColumn()
  usu_codigo: string;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'usu_codigo' })
  usuario: Usuario;

  @JoinColumn()
  @ManyToOne(() => Sistema)
  @JoinColumn({ name: 'sis_codigo' })
  sis_codigo: Sistema;
}

export default SistemaUsuario;
