import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('fases', { schema: 'sav2' })
class Fases {
  @PrimaryGeneratedColumn()
  id_fase: number;

  @Column()
  nome_fase: string;

  @Column()
  criado_por: string;

  @Column()
  criado_em: Date;
}

export default Fases;
