import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('pessoa_email', { schema: 'public' })
class PessoaEmail {
  @PrimaryColumn()
  pes_codigo_email: number;

  @Column()
  pes_codigo: string;

  @Column()
  pes_tipo_email: string;

  @Column()
  pes_email: string;

  @Column()
  usuario_cadastro: string;

  @Column()
  usuario_alteracao: string;

  @Column()
  data_cadastro: Date;

  @Column()
  data_alteracao: Date;
}

export default PessoaEmail;
