import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('estados', { schema: 'sav2' })
class Estado {
  @PrimaryGeneratedColumn()
  id_estado: number;

  @Column()
  sigla: string;

  @Column()
  nome: string;

  @Column()
  regiao: string;
}

export default Estado;
