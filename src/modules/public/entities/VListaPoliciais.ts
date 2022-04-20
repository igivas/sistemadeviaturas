import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('v_lista_num_mat_gra_nome', { schema: 'public' })
class VListaPoliciais {
  @PrimaryColumn()
  pm_codigo: string;

  @Column()
  nome: string;

  @Column()
  tipo_situcao: string;
}

// @Entity('v_lista_policiais', { schema: 'public' })
// class VListaPoliciais {
//   @PrimaryColumn()
//   pes_codigo: string;

//   @Column()
//   pes_nome: string;

//   @Column()
//   pm_apelido: string;

//   @Column()
//   pm_numero: string;

//   @Column()
//   sexo: string;

//   @Column()
//   pm_cpf: string;

//   @Column()
//   gra_nome: string;

//   @Column()
//   uni_codigo: number;

//   @Column()
//   uni_nome: string;
// }
export default VListaPoliciais;
