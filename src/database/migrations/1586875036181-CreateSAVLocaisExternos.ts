import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateSAVLocaisExternos1586875036191
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'sav2.locais_externos',
        columns: [
          {
            name: 'id_local_externo',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
          },
          {
            name: 'descricao',
            type: 'varchar',
            length: '60',
            isNullable: false,
          },
          {
            name: 'tipo_local',
            type: 'varchar',
            length: '1',
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
        foreignKeys: [],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('sav2.locais_externos');
  }
}
