import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('pessoa', { schema: 'public' })
class Pessoa {
  @PrimaryColumn()
  pes_codigo: string;

  @Column()
  pes_nome: string;
}

export default Pessoa;
