import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import Aquisicao from '@modules/veiculos/entities/Aquisicao';
import {
  EOrigemDeAquisicao,
  EFormaDeAquisicao,
} from '@modules/veiculos/enums/EAquisicao';
import veiculos from './veiculos/list_veiculos_2.js';

export default class Aquisicoes implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const formatedAquisicoes = veiculos.map((veiculo, index) =>
      index === 0
        ? {
            data_aquisicao: new Date(),
            id_veiculo: index + 1,
            origem_aquisicao: EOrigemDeAquisicao.CESSAO,
            forma_aquisicao: EFormaDeAquisicao.DOACAO,
            criado_por: '30891368',
            id_orgao_aquisicao: 5,
          }
        : {
            data_aquisicao: new Date(),
            id_veiculo: index + 1,
            origem_aquisicao: EOrigemDeAquisicao.ORGANICO,
            forma_aquisicao: EFormaDeAquisicao.DOACAO,
            criado_por: '30891368',
            id_orgao_aquisicao: 5,
          },
    );

    await connection
      .createQueryBuilder()
      .insert()
      .into(Aquisicao)
      .values(formatedAquisicoes)
      .execute();
  }
}
