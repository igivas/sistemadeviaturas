import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('endereco', { schema: 'public' })
class Endereco {
  @PrimaryColumn('varchar', { name: 'end_codigo' })
  id_endereco: string;

  @Column('varchar', { name: 'mun_codigo' })
  id_municipio: string;

  @Column({ name: 'end_endereco' })
  nome: string;

  @Column({ name: 'end_cep' })
  cep: string;
}

export default Endereco;
