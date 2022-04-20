import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import Identificador from '@modules/veiculos/entities/Identificador';
import veiculos from './veiculos/list_veiculos_2.js';

export default class Identificadores implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const makeString = (length: number): string => {
      const result = [];
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.split(
        '',
      );
      for (let i = 0; i < length; i += 1) {
        result.push(characters[Math.floor(Math.random() * characters.length)]);
      }
      return result.join('');
    };

    const formatedMovimentacoes = veiculos.map((veiculo, index) => ({
      criado_por: '30891368',
      identificador: makeString(6),
    }));

    await connection
      .createQueryBuilder()
      .insert()
      .into(Identificador)
      .values(formatedMovimentacoes)
      .execute();
  }
}
