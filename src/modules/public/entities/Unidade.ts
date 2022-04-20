import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('unidade', { schema: 'public' })
class Unidade {
  @PrimaryColumn()
  uni_codigo: number;

  @Column()
  uni_nome: string;

  @Column()
  uni_sigla: string;

  @Column()
  uni_lob: number;

  @Column()
  pes_comandante: string;

  @Column()
  pes_codigo: string;

  @Column()
  pes_subcomandante: string;

  @Column()
  pes_respondendo: string;

  @Column()
  uni_superior: number;

  @Column()
  uni_grd_cmdo: number;
}

export default Unidade;
