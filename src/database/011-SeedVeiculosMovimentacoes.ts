import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import Movimentacao from '@modules/veiculos/entities/Movimentacao';
import ETipoMovimentacao from '../../modules/veiculos/enums/ETipoMovimentacao';
import veiculos from './veiculos/list_veiculos_2.js';

export default class VeiculosMovimentacoes implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const dataAtual = new Date();

    const formatedMovimentacoes = veiculos.map((veiculo, index) => ({
      id_veiculo: index + 1,
      tipo_movimentacao: ETipoMovimentacao.TRANSFERENCIA,
      criado_por: '30891368',
      observacao: 'Criação do veiculo',
      data_movimentacao: new Date(
        dataAtual.getFullYear(),
        dataAtual.getMonth(),
        dataAtual.getDate(),
      ),
    }));

    await connection
      .createQueryBuilder()
      .insert()
      .into(Movimentacao)
      .values(formatedMovimentacoes)
      .execute();
  }
}
