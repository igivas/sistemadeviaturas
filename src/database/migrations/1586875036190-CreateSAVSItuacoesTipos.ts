import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateSAVSituacoesTipos1586875036190
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'sav2.situacoes_tipos',
        columns: [
          {
            name: 'id_situacao_tipo',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
          },
          {
            name: 'nome',
            type: 'varchar',
            length: '30',
            isNullable: true,
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
        foreignKeys: [],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('sav2.situacoes_tipos');
  }
}
