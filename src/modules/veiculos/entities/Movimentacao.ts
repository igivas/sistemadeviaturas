import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';

import Veiculo from './Veiculo';
import MovimentacaoFase from './MovimentacaoFase';
import TipoMovimentacao from './TipoMovimentacao';
import DadoMovimentacaoMudancaVeiculo from './DadoMovimentacaoMudancaVeiculo';
import ETipoMovimentacao from '../enums/ETipoMovimentacao';

/* export enum TiposMovimentacao {
  'Tranferência' = '1',
  'Empréstimo' = '2',
}
 */

@Entity('movimentacoes', { schema: 'sav2' })
class Movimentacao {
  @PrimaryGeneratedColumn()
  id_movimentacao: number;

  @Column()
  id_veiculo: number;

  @ManyToOne(() => Veiculo)
  @JoinColumn({ name: 'id_veiculo' })
  veiculo: Veiculo;
  /*
  @Column({
    type: 'enum',
    enum: TiposMovimentacao,
    default: TiposMovimentacao['Tranferência'],
  })
  tipo_movimentacao: string; */

  @Column()
  data_movimentacao: Date;

  @Column({
    type: 'enum',
    enum: ETipoMovimentacao,
  })
  tipo_movimentacao: ETipoMovimentacao;

  @Column()
  id_documento_sga: number;

  @Column()
  url_documento_sga: string;

  @Column()
  id_documento_devolucao_sga: number;

  @Column()
  url_documento_devolucao_sga: string;

  @Column()
  data_retorno: Date;

  @Column()
  previsao_retorno: Date;

  @Column()
  observacao: string;

  @Column()
  criado_por: string;

  @CreateDateColumn()
  criado_em: Date;

  @ManyToOne(() => TipoMovimentacao)
  @JoinColumn({ name: 'tipo_movimentacao' })
  tipoMovimentacao: TipoMovimentacao;

  @OneToMany(
    () => MovimentacaoFase,
    movimentacaoFase => movimentacaoFase.movimentacao,
  )
  movimentacoesFase: MovimentacaoFase[];

  @OneToOne(
    () => DadoMovimentacaoMudancaVeiculo,
    dadoMovimentacaoMudancaVeiculo =>
      dadoMovimentacaoMudancaVeiculo.movimentacao,
  )
  dadoMovimentacaoMudancaVeiculo: DadoMovimentacaoMudancaVeiculo;
}

export default Movimentacao;
