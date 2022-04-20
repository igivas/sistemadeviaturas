import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('pessoa_endereco', { schema: 'public' })
class PessoaEndereco {
  @PrimaryColumn()
  pes_codigo_endereco: number;

  @Column()
  pes_codigo: string;

  @Column()
  pes_tipo_endereco: string;

  @Column()
  pes_situacao_endereco: string;

  @Column()
  pes_cep: string;

  @Column()
  pes_endereco: string;

  @Column()
  pes_endereco_num: string;

  @Column()
  pes_endereco_complemento: string;

  @Column()
  pes_bairro: string;

  @Column()
  pes_cidade: string;

  @Column()
  pes_estado: string;

  @Column()
  pes_pais: string;

  @Column()
  data_cadastro: Date;

  @Column()
  usuario_cadastro: string;

  @Column()
  usuario_alteracao: string;

  @Column()
  data_alteracao: Date;
}

export default PessoaEndereco;
