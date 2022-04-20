import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import MovimentacaoTransferencia from '@modules/veiculos/entities/MovimentacaoTransferencia';
import veiculos from './seeds/veiculos/list_veiculos_2.js';

export default class MovimentacoesTransferencia implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const formatedMovimentacoes = veiculos.map(
      (veiculo, index) =>
        ({
          id_opm_destino: 1472,
          id_dado_movimentacao_mudanca: index + 1,
          assinado_destino: '1',
        } as MovimentacaoTransferencia),
    );

    await connection
      .createQueryBuilder()
      .insert()
      .into(MovimentacaoTransferencia)
      .values(formatedMovimentacoes)
      .execute();
  }
}
