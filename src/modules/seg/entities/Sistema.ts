import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import SistemaUsuario from './SistemaUsuario';

@Entity('sistemas', { schema: 'seg' })
class Sistema {
  @PrimaryGeneratedColumn()
  sis_codigo: number;

  @Column()
  sis_nome: string;

  @Column()
  sis_sigla: string;

  @OneToMany(() => SistemaUsuario, sistemaUsuario => sistemaUsuario.sis_codigo)
  sistemaUsuario: SistemaUsuario[];
}
export default Sistema;
