import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import MovimentacaoFase from '@modules/veiculos/entities/MovimentacaoFase';
import EFase from '@modules/veiculos/enums/EFase';
import veiculos from './seeds/veiculos/list_veiculos_2.js';

export default class VeiculosMovimentacoesFases implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const formatedMovimentacoes = veiculos.map((veiculo, index) => ({
      id_movimentacao: index + 1,
      criado_por: '30891368',
      id_tipo_fase: EFase.Recebimento,
      obs: 'Criacao do Veiculo',
    }));

    await connection
      .createQueryBuilder()
      .insert()
      .into(MovimentacaoFase)
      .values(formatedMovimentacoes)
      .execute();
  }
}
