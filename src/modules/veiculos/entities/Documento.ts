import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  BeforeUpdate,
  UpdateDateColumn,
} from 'typeorm';
import ETipoDocumento from '../enums/ETipoDocumento';

@Entity('documentos', { schema: 'sav2' })
class Documento {
  @PrimaryGeneratedColumn()
  id_documento: number;

  @Column({
    type: 'enum',
    enum: ETipoDocumento,
  })
  tipo_documento: ETipoDocumento;

  @Column()
  numero_documento: number;

  @Column()
  ano_documento: number;

  @Column()
  criado_por: string;

  @CreateDateColumn()
  criado_em: Date;

  @Column()
  atualizado_por: string;

  @UpdateDateColumn()
  atualizado_em: Date;

  @BeforeUpdate()
  updateAtualizadoEm? = (): void => {
    this.atualizado_em = new Date();
  };
}

export default Documento;
