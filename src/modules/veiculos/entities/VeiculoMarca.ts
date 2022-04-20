import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('veiculos_marcas', { schema: 'sav2' })
class VeiculoMarca {
  @PrimaryGeneratedColumn()
  id_veiculo_marca: number;

  @Column()
  nome: string;

  @Column({ nullable: false })
  criado_por: string;

  @CreateDateColumn()
  criado_em: Date;
}

export default VeiculoMarca;
