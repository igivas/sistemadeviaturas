import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import SituacaoTipoLocalizacao from '@modules/veiculos/entities/SituacaoTipoLocalizacao';

export default class SituacoesTiposLocalizacoes implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const situacoesTiposLocalizacoes = [
      {
        criado_por: '30891368',
        id_situacao_tipo: 1,
        localizacao: 'Patio Opm',
      },

      {
        criado_por: '30891368',
        id_situacao_tipo: 1,
        localizacao: 'Oficina',
      },

      {
        criado_por: '30891368',
        id_situacao_tipo: 1,
        localizacao: 'Outro',
      },

      {
        criado_por: '30891368',
        id_situacao_tipo: 2,
        localizacao: 'Patio Opm',
      },

      {
        criado_por: '30891368',
        id_situacao_tipo: 2,
        localizacao: 'Conforme Escala',
      },

      {
        criado_por: '30891368',
        id_situacao_tipo: 3,
        localizacao: 'Patio Opm',
      },

      {
        criado_por: '30891368',
        id_situacao_tipo: 3,
        localizacao: 'Outro',
      },

      {
        criado_por: '30891368',
        id_situacao_tipo: 3,
        localizacao: 'Patio Colog',
      },

      {
        criado_por: '30891368',
        id_situacao_tipo: 3,
        localizacao: 'Deposito',
      },
    ];

    await connection
      .createQueryBuilder()
      .insert()
      .into(SituacaoTipoLocalizacao)
      .values(situacoesTiposLocalizacoes)
      .execute();
  }
}
