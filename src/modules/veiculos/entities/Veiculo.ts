import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToMany,
  ManyToOne,
  OneToOne,
  BeforeUpdate,
} from 'typeorm';
import Movimentacao from './Movimentacao';
import Km from './Km';
import Prefixo from './Prefixo';
import VeiculoEspecie from './VeiculoEspecie';
import VeiculoMarca from './VeiculoMarca';
import VeiculoModelo from './VeiculoModelo';
import SituacaoVeiculo from './SituacaoVeiculo';
import Aquisicao from './Aquisicao';
import Orgao from './Orgao';
import VeiculoIdenficador from './VeiculoIdentificador';
import VeiculoCargaTransferencia from './VeiculoCargaTransferencia';
import SituacaoTipo from './SituacaoTipo';
import VeiculoPneu from './VeiculoPneu';
import ECombustivel from '../enums/ECombustivel';
import ETipoDocCarga from '../enums/ETipoDocCarga';
import SituacaoTipoEspecificao from './SituacaoTipoEspecificao';
import VeiculoLocalizacao from './VeiculoLocalizacao';

@Entity('veiculos', { schema: 'sav2' })
class Veiculo {
  @PrimaryGeneratedColumn()
  id_veiculo: number;

  @Column()
  id_veiculo_especie: number;

  @Column()
  id_situacao_tipo: number;

  @Column()
  id_situacao_especificacao_atual: number;

  @Column()
  orgao_tombo?: number;

  @Column()
  tombo?: string;

  @Column()
  id_marca: number;

  @Column()
  id_modelo: number;

  @Column()
  id_cor: number;

  @Column()
  ano_fabricacao: string;

  @Column()
  ano_modelo: string;

  @Column()
  placa: string;

  @Column()
  chassi: string;

  @Column()
  numero_motor?: string;

  @Column()
  numero_crv: string;

  @Column()
  renavam: string;

  @Column()
  codigo_seguranca_crv: string;

  @Column()
  uf: string;

  @Column()
  is_reserva: '0' | '1';

  @Column({
    type: 'enum',
    enum: ECombustivel,
  })
  combustivel: ECombustivel;

  @Column()
  valor_fipe: number;

  @Column('date')
  data_operacao?: Date;

  @Column({
    type: 'enum',
    enum: ETipoDocCarga,
  })
  tipo_doc_carga: ETipoDocCarga;

  @Column()
  numero_doc_carga?: string;

  @Column('date')
  data_doc_carga?: Date;

  @Column()
  adesivado: string;

  @Column()
  km_troca_pneus: number;

  @Column()
  observacao: string;

  @Column()
  criado_por: string;

  @Column()
  atualizado_por: string;

  @CreateDateColumn()
  criado_em: Date;

  @UpdateDateColumn()
  atualizado_em: Date;

  @OneToMany(() => SituacaoVeiculo, situacao => situacao.veiculo)
  situacoes: SituacaoVeiculo[];

  @OneToMany(() => Movimentacao, movimentacao => movimentacao.veiculo)
  movimentacoes: Movimentacao[];

  @OneToMany(() => VeiculoIdenficador, identificador => identificador.veiculo)
  identificadores: VeiculoIdenficador[];

  @OneToMany(() => Km, km => km.veiculo)
  kms: Km[];

  @OneToMany(() => Prefixo, prefixo => prefixo.veiculo)
  prefixos: Prefixo[];

  @OneToMany(() => Aquisicao, aquisicao => aquisicao.veiculo)
  aquisicoes: Aquisicao[];

  @OneToMany(() => VeiculoPneu, veiculoPneu => veiculoPneu.veiculo)
  referenciasPneus: VeiculoPneu[];

  @ManyToOne(() => VeiculoEspecie)
  @JoinColumn({ name: 'id_veiculo_especie' })
  veiculoEspecie: VeiculoEspecie;

  @ManyToOne(() => VeiculoMarca)
  @JoinColumn({ name: 'id_marca' })
  veiculoMarca: VeiculoMarca;

  @ManyToOne(() => VeiculoModelo)
  @JoinColumn({ name: 'id_modelo' })
  veiculoModelo: VeiculoModelo;

  @ManyToOne(() => Orgao)
  @JoinColumn({ name: 'orgao_tombo' })
  veiculoOrgao: Orgao;

  @OneToOne(
    () => VeiculoCargaTransferencia,
    veiculoCargaTransferencia => veiculoCargaTransferencia.veiculo,
  )
  veiculoCarga: VeiculoCargaTransferencia;

  @OneToOne(() => SituacaoTipo)
  @JoinColumn({ name: 'id_situacao_tipo' })
  situacaoTipoAtual: SituacaoTipo;

  @OneToOne(() => SituacaoTipoEspecificao)
  @JoinColumn({ name: 'id_situacao_especificacao_atual' })
  situacaoTipoEspecificacaoAtual: SituacaoTipoEspecificao;

  @OneToMany(
    () => VeiculoLocalizacao,
    veiculoLocalizacao => veiculoLocalizacao.veiculo,
  )
  localizacoes: VeiculoLocalizacao[];

  @BeforeUpdate()
  updateAtualizadoEm? = (): void => {
    this.atualizado_em = new Date();
  };
}

export default Veiculo;
