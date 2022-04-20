import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateSAVIdentificadores1586875036192
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'sav2.identificadores',
        columns: [
          {
            name: 'id_identificador',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
          },

          {
            name: 'identificador',
            type: 'varchar',
            length: '15',
            isNullable: false,
          },

          {
            name: 'observacao',
            type: 'varchar',
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
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('sav2.identificadores');
  }
}
