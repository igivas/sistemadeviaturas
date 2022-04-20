import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('municipio', { schema: 'public' })
class Municipio {
  @PrimaryColumn('varchar', { name: 'mun_codigo', length: 6 })
  id_municipio: string;

  @Column({ name: 'uf_codigo', length: 2 })
  id_uf: string;

  @Column({ name: 'mun_nome', length: 80 })
  nome: string;
}

export default Municipio;
