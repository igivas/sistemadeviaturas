import { Column, Entity, PrimaryColumn, OneToOne, JoinColumn } from 'typeorm';
import Pessoa from './Pessoa';
import Graduacao from './Graduacao';
import Unidade from './Unidade';

@Entity('pessoa_pm', { schema: 'public' })
class PessoaFisicaPm {
  @PrimaryColumn()
  pm_codigo: string;

  @Column()
  pm_apelido: string;

  @Column()
  pm_numero: string;

  @Column()
  gra_codigo: number;

  @Column()
  uni_codigo: number;

  @Column()
  pm_cpf: string;

  @Column()
  pm_atividade: string;

  @OneToOne(() => Pessoa)
  @JoinColumn({ name: 'pm_codigo' })
  pessoa: Pessoa;

  @OneToOne(() => Graduacao)
  @JoinColumn({ name: 'gra_codigo' })
  graduacao: Graduacao;

  @OneToOne(() => Unidade)
  @JoinColumn({ name: 'uni_codigo' })
  opm: Unidade;

  @Column('timestamp without time zone')
  data_alteracao: Date;

  @Column()
  usuario_alteracao: string;

  @Column('bytea')
  pm_foto: Buffer;
}

export default PessoaFisicaPm;
