import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('uf', { schema: 'public' })
class Uf {
  @PrimaryColumn('varchar', { length: 2, name: 'uf_codigo' })
  id_uf: string;

  @Column({ name: 'uf_nome' })
  nome: string;

  @Column({ name: 'uf_sigla' })
  sigla: string;
}

export default Uf;
