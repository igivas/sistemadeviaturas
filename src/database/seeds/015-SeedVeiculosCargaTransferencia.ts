import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import VeiculoCargaTransferencia from '@modules/veiculos/entities/VeiculoCargaTransferencia';
import veiculos from './veiculos/list_veiculos_2.js';

export default class VeiculosCargaTransferencia implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const now = new Date();

    const formatedMovimentacoes = veiculos.map((veiculo, index) => ({
      id_veiculo: index + 1,
      opm_carga: 1472,
      opm_carga_lob: '2021',
      data_carga: new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
      ).toISOString(),
      criado_por: '30891368',
    }));

    await connection
      .createQueryBuilder()
      .insert()
      .into(VeiculoCargaTransferencia)
      .values(formatedMovimentacoes)
      .execute();
  }
}
