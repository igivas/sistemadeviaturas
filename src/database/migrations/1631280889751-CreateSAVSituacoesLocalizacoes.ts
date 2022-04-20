import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateSAVSituacoesLocalizacoes1631280889751
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'sav2.situacoes_tipos_localizacoes',
        columns: [
          {
            name: 'id_situacao_tipo_localizacao',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
          },
          {
            name: 'id_situacao_tipo',
            type: 'int',
          },
          {
            name: 'localizacao',
            type: 'varchar',
            length: '70',
          },
          {
            name: 'criado_por',
            type: 'varchar',
            length: '30',
            isNullable: true,
          },

          {
            name: 'criado_em',
            type: 'timestamp',
            default: 'now()',
          },
        ],
        foreignKeys: [
          {
            name: 'VeiculoSituacaoTipoAtual',
            referencedTableName: 'sav2.situacoes_tipos',
            referencedColumnNames: ['id_situacao_tipo'],
            columnNames: ['id_situacao_tipo'],
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    if (process.env.IS_DEVELOPMENT) {
      await queryRunner.dropSchema('sav2', undefined, true);
      await queryRunner.query(
        `DELETE from public.migrations where LOWER(name) ilike LOWER('%sav%')`,
      );
    } else {
      await queryRunner.dropTable('sav2.situacoes_tipos_localizacoes');
    }
  }
}
