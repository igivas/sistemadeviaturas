import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('pessoa_fone', { schema: 'public' })
class PessoaTelefone {
  @PrimaryColumn()
  pes_codigo_fone: number;

  @Column()
  pes_codigo: string;

  @Column()
  pes_tipo_fone: string;

  @Column()
  pes_fone: string;

  @Column()
  usuario_cadastro: string;

  @Column()
  usuario_alteracao: string;

  @Column()
  data_cadastro: Date;

  @Column()
  data_alteracao: Date;
}

export default PessoaTelefone;
