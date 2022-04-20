import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import SituacaoTipo from '../../modules/veiculos/entities/SituacaoTipo';

export default class SituacoesTipos implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(SituacaoTipo)
      .values([
        { nome: 'Baixada' },
        { nome: 'Operando' },
        { nome: 'Inservível' },
        { nome: 'Inativo' },
      ])
      .execute();
  }
}
