import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import Veiculo from '@modules/veiculos/entities/Veiculo';
import veiculos from './veiculos/list_veiculos_2.js';

export default class Veiculos implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(Veiculo)
      .values(veiculos)
      .execute();
  }
}
