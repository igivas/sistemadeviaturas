import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import Veiculo from './Veiculo';
import VeiculoCargaTransferencia from './VeiculoCargaTransferencia';
import VeiculoEspecie from './VeiculoEspecie';
import VeiculoMarca from './VeiculoMarca';

@Entity('veiculos_modelos', { schema: 'sav2' })
class VeiculoModelo {
  @PrimaryGeneratedColumn()
  id_veiculo_modelo: number;

  @Column()
  id_veiculo_marca: number;

  @Column()
  id_veiculo_especie: number;

  @Column({ length: 20, nullable: false })
  nome: string;

  @Column()
  criado_por: string;

  @CreateDateColumn()
  criado_em: Date;

  @OneToMany(() => Veiculo, veiculo => veiculo.veiculoModelo)
  veiculos: Veiculo[];

  @ManyToOne(() => VeiculoMarca)
  @JoinColumn({ name: 'id_veiculo_marca' })
  veiculoMarca: VeiculoMarca;

  @ManyToOne(() => VeiculoEspecie)
  @JoinColumn({ name: 'id_veiculo_especie' })
  veiculoEspecie: VeiculoEspecie;

  @OneToOne(
    () => VeiculoCargaTransferencia,
    veiculoCargaTransferencia => veiculoCargaTransferencia.veiculo,
  )
  veiculoCarga: VeiculoCargaTransferencia;
}

export default VeiculoModelo;
