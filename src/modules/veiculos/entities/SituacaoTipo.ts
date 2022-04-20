import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import Veiculo from './Veiculo';
import SituacaoTipoEspecificao from './SituacaoTipoEspecificao';
import SituacaoTipoLocalizacao from './SituacaoTipoLocalizacao';

@Entity('situacoes_tipos', { schema: 'sav2' })
class SituacaoTipo {
  @PrimaryGeneratedColumn()
  id_situacao_tipo: number;

  @Column()
  nome: string;

  @Column()
  criado_por: string;

  @CreateDateColumn()
  criado_em: Date;

  @OneToOne(() => Veiculo, veiculo => veiculo.situacaoTipoAtual)
  veiculo: Veiculo;

  @OneToMany(
    () => SituacaoTipoEspecificao,
    situacaoTipoEspecificao => situacaoTipoEspecificao.situacaoTipo,
  )
  situacoesTiposEspecificacoes: SituacaoTipoEspecificao[];

  @OneToMany(
    () => SituacaoTipoLocalizacao,
    situacaoTipoLocalizacao => situacaoTipoLocalizacao.situacaoTipo,
  )
  situacoesTiposLocalizacoes: SituacaoTipoLocalizacao[];
}

export default SituacaoTipo;
