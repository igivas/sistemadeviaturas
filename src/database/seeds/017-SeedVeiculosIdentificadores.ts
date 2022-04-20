import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import VeiculoIdenficador from '@modules/veiculos/entities/VeiculoIdentificador';
import veiculos from './veiculos/list_veiculos_2.js';

export default class VeiculosIdentificadores implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const formatedMovimentacoes = veiculos.map(
      (veiculo, index) =>
        ({
          criado_por: '30891368',
          id_identificador: index + 1,
          id_veiculo: index + 1,
          ativo: '1' as string,
          data_identificador: new Date(),
          observacao: 'Criação do Veiculo',
        } as VeiculoIdenficador),
    );

    await connection
      .createQueryBuilder()
      .insert()
      .into(VeiculoIdenficador)
      .values(formatedMovimentacoes)
      .execute();
  }
}
