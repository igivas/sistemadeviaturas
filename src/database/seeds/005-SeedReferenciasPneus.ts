import { Seeder, Factory } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import Pneus from '@modules/veiculos/entities/Pneu';

export default class ReferenciasPneus implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(Pneus)
      .values([
        {
          referencia: '165/70R13',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '175/70R13',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '185/70R13',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '165/60R14',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '165/70R14',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '175/65R14',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '175/70R14',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '175/80R14',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '185/60R14',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '185/65R14',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '185/70R14',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '195/60R14',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '195/75R14',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '155/60R15',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '175/55R15',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '175/60R15',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '175/65R15',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '185/55R15',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '185/60R15',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '185/65R15',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '195/45R15',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '195/50R15',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '195/55R15',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '195/60R15',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '195/65R15',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '195/70R15',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '205/60R15',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '205/65R15',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '205/70R15',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '215/65R15',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '225/70R15',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '235/75R15',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '255/70R15',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '255/75R15',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '265/70R15',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '195/50R16',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '195/55R16',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '195/60R16',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '195/75R16',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '205/45R16',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '205/55R16',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '205/60R16',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '205/75R16',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '215/55R16',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '215/65R16',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '215/70R16',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '215/75R16',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '215/80R16',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '225/50R16',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '225/55R16',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '225/65R16',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '225/70R16',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '225/75R16',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '235/60R16',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '235/70R16',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '235/85R16',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '245/70R16',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '245/75R16',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '255/70R16',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '265/70R16',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '265/75R16',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '295/75R16',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '195/40R17',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '205/40R17',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '205/45R17',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '215/40R17',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '215/45R17',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '215/55R17',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '215/60R17',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '225/45R17',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '225/50R17',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '225/65R17',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '235/45R17',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '235/55R17',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '235/60R17',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '245/40R17',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '245/45R17',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '245/65R17',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '255/65R17',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '265/65R17',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '265/70R17',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '205/45R18',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '215/40R18',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '215/45R18',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '215/55R18',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '225/40R18',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '225/45R18',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '225/50R18',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '225/55R18',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '235/40R18',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '235/45R18',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '235/50R18',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '235/55R18',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '235/60R18',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '245/45R18',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '245/60R18',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '255/55R18',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '255/60R18',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '225/35R19',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '225/55R19',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '235/35R19',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '235/55R19',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '245/35R19',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '255/50R19',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '255/55R19',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '225/30R20',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '225/35R20',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '245/45R20',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '245/50R20',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '265/50R20',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
        {
          referencia: '275/40R20',
          id_veiculo_especie: 4,
          criado_por: '13444013',
        },
      ])
      .execute();
  }
}
