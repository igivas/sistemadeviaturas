import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import SituacaoTipoEspecificao from '@modules/veiculos/entities/SituacaoTipoEspecificao';

export default class SituacoesTiposEspecificoes implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(SituacaoTipoEspecificao)
      .values([
        { id_situacao_tipo: 1, especificacao: 'Manutenção' },
        { id_situacao_tipo: 1, especificacao: 'Falta de combustível' },
        { id_situacao_tipo: 1, especificacao: 'Em tramitação de combustível' },
      ])
      .execute();
  }
}
