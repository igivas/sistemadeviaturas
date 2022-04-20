import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateSAVDocumentos1586875036122
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'sav2.documentos',
        columns: [
          {
            name: 'id_documento',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
          },

          {
            name: 'tipo_documento',
            type: 'int',
          },

          {
            name: 'numero_documento',
            type: 'int',
          },
          {
            name: 'ano_documento',
            type: 'int',
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

          {
            name: 'atualizado_por',
            type: 'varchar',
            length: '30',
            isNullable: true,
          },

          {
            name: 'atualizado_em',
            type: 'timestamp',
            isNullable: true,
            // default: 'now()',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('sav2.documentos');
  }
}
