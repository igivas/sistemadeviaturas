import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import SituacaoTipo from './SituacaoTipo';

@Entity('situacoes_tipos_localizacoes', { schema: 'sav2' })
class SituacaoTipoLocalizacao {
  @PrimaryGeneratedColumn()
  id_situacao_tipo_localizacao: number;

  @Column()
  id_situacao_tipo: number;

  @Column()
  localizacao: string;

  @Column()
  criado_por: string;

  @CreateDateColumn()
  criado_em: Date;

  @ManyToOne(() => SituacaoTipo)
  @JoinColumn({ name: 'id_situacao_tipo' })
  situacaoTipo: SituacaoTipo;
}

export default SituacaoTipoLocalizacao;
