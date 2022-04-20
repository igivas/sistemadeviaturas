import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import TipoMovimentacao from '@modules/veiculos/entities/TipoMovimentacao';

export default class TiposMovimentacoes implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(TipoMovimentacao)
      .values([
        { tipo_movimentacao: 'Transferência', criado_por: '123' },
        { tipo_movimentacao: 'Empréstimo', criado_por: '123' },
        { tipo_movimentacao: 'Cessão', criado_por: '123' },
        { tipo_movimentacao: 'Manutenção', criado_por: '123' },
        { tipo_movimentacao: 'Descarga', criado_por: '123' },
        { tipo_movimentacao: 'Devolucao de Locação', criado_por: '123' },
      ])
      .execute();
  }
}
