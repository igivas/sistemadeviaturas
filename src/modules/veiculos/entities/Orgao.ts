import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import Aquisicao from './Aquisicao';
import Veiculo from './Veiculo';

@Entity('orgaos', { schema: 'sav2' })
class Orgao {
  @PrimaryGeneratedColumn()
  id_orgao: number;

  @Column()
  ente_federativo: string;

  @Column()
  nome: string;

  @Column()
  unidade: string;

  @Column()
  sigla: string;

  @Column()
  criado_por: string;

  @CreateDateColumn()
  criado_em: Date;

  @OneToMany(() => Aquisicao, aquisicao => aquisicao.id_orgao_aquisicao)
  aquisicoes: Aquisicao[];

  @OneToMany(() => Veiculo, veiculo => veiculo.orgao_tombo)
  veiculos: Veiculo[];
}

export default Orgao;
