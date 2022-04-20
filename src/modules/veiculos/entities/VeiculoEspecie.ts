import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('veiculos_especies', { schema: 'sav2' })
class VeiculoEspecie {
  @PrimaryGeneratedColumn()
  id_veiculo_especie: number;

  @Column()
  nome: string;

  @Column()
  criado_por: string;

  @Column()
  atualizado_por: string;

  @CreateDateColumn()
  criado_em: Date;

  @UpdateDateColumn()
  atualizado_em: Date;
}

export default VeiculoEspecie;
