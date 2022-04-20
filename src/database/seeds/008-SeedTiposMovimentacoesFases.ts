import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import Fases from '@modules/veiculos/entities/Fases';
import EFases from '@modules/veiculos/enums/EFase';

export default class TiposMovimentacoesFases implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(Fases)
      .values([
        {
          nome_fase: EFases[1],
          criado_por: '30891368',
        },
        {
          nome_fase: EFases[2],
          criado_por: '30891368',
        },
        {
          nome_fase: EFases[3],
          criado_por: '30891368',
        },
        {
          nome_fase: EFases[4],
          criado_por: '30891368',
        },
        {
          nome_fase: EFases[5],
          criado_por: '30891368',
        },
        {
          nome_fase: EFases[6],
          criado_por: '30891368',
        },
        {
          nome_fase: EFases[7],
          criado_por: '30891368',
        },
        {
          nome_fase: EFases[8],
          criado_por: '30891368',
        },
        {
          nome_fase: EFases[9],
          criado_por: '30891368',
        },
      ])
      .execute();
  }
}
