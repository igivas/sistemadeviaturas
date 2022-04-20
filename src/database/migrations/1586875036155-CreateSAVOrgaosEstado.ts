import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateSAVOrgaosEstado1586875036155
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'sav2.orgaos',
        columns: [
          {
            name: 'id_orgao',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
          },
          {
            name: 'ente_federativo',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'unidade',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'nome',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'sigla',
            type: 'varchar',
            length: '15',
            isNullable: false,
          },

          {
            name: 'criado_por',
            type: 'varchar',
            length: '30',
            isNullable: false,
          },

          {
            name: 'criado_em',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('sav2.orgaos');
  }
}
