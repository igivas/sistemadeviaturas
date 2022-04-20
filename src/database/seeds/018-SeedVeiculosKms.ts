import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import Km from '@modules/veiculos/entities/Km';
import veiculos from './veiculos/list_veiculos_2.js';

export default class VeiculosIdentificadores implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const formatedMovimentacoes = veiculos.map(
      (veiculo, index) =>
        ({
          criado_por: '30891368',
          data_km: new Date(),
          km_atual: Math.floor(Math.random() * (80000 - 1) + 1),
          id_veiculo: index + 1,
        } as Km),
    );

    await connection
      .createQueryBuilder()
      .insert()
      .into(Km)
      .values(formatedMovimentacoes)
      .execute();
  }
}
