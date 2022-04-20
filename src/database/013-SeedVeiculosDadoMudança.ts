import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import DadoMovimentacaoMudancaVeiculo from '@modules/veiculos/entities/DadoMovimentacaoMudancaVeiculo';
import veiculos from './seeds/veiculos/list_veiculos_2.js';

export default class VeiculosDadoMovimentacaoMudanca implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const formatedMovimentacoes = veiculos.map(
      (veiculo, index) =>
        ({
          id_movimentacao: index + 1,
          id_opm_origem: 1472,
          assinado_origem: '1',
        } as DadoMovimentacaoMudancaVeiculo),
    );

    await connection
      .createQueryBuilder()
      .insert()
      .into(DadoMovimentacaoMudancaVeiculo)
      .values(formatedMovimentacoes)
      .execute();
  }
}
