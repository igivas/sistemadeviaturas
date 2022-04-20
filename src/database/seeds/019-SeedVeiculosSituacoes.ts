import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import SituacaoVeiculo from '@modules/veiculos/entities/SituacaoVeiculo';
import veiculos from './veiculos/list_veiculos_2.js';

export default class VeiculosSituacoes implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const date = new Date();
    const formatedMovimentacoes = veiculos.map(
      (veiculo, index) =>
        (index === 0
          ? {
              criado_por: '30891368',
              data_situacao: new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate(),
              ),
              id_situacao_tipo: 2,
              id_veiculo: index + 1,
              id_km: index + 1,
            }
          : {
              criado_por: '30891368',
              data_situacao: new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate(),
              ),

              id_situacao_tipo: 4,
              id_veiculo: index + 1,
              id_km: index + 1,
            }) as SituacaoVeiculo,
    );

    await connection
      .createQueryBuilder()
      .insert()
      .into(SituacaoVeiculo)
      .values(formatedMovimentacoes)
      .execute();
  }
}
