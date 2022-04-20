import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import SituacaoTipo from './SituacaoTipo';
import Veiculo from './Veiculo';

@Entity('situacoes_tipos_especificacoes', { schema: 'sav2' })
class SituacaoTipoEspecificao {
  @PrimaryGeneratedColumn()
  id_situacao_especificacao: number;

  @Column()
  id_situacao_tipo: number;

  @Column()
  especificacao: string;

  @Column()
  criado_por: string;

  @CreateDateColumn()
  criado_em: Date;

  @ManyToOne(() => SituacaoTipo)
  @JoinColumn({ name: 'id_situacao_tipo' })
  situacaoTipo: SituacaoTipo;

  @OneToOne(() => Veiculo, veiculo => veiculo.situacaoTipoEspecificacaoAtual)
  veiculo: Veiculo;
}

export default SituacaoTipoEspecificao;
