import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import VeiculoCor from '../../modules/veiculos/entities/VeiculoCor';

export default class VeiculosCores implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(VeiculoCor)
      .values([
        { nome: 'Grená' },
        { nome: 'Rosa' },
        { nome: 'Fantasia' },
        { nome: 'Roxa' },
        { nome: 'Dourada' },
        { nome: 'Laranja' },
        { nome: 'Marrom' },
        { nome: 'Amarela' },
        { nome: 'Bege' },
        { nome: 'Verde' },
        { nome: 'Azul' },
        { nome: 'Cinza' },
        { nome: 'Vermelha' },
        { nome: 'Preta' },
        { nome: 'Prata' },
        { nome: 'Branca' },
        { nome: 'Outras' },
      ])
      .execute();
  }
}
