import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateSAVGruposEmails1625838999791
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'sav2.grupos_emails',
        columns: [
          {
            name: 'id_grupo',
            type: 'int',
            isPrimary: true,
          },

          {
            name: 'id_grupo_email',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'id_email',
            type: 'int',
            isNullable: false,
          },

          {
            name: 'criado_por',
            type: 'varchar',
            length: '30',
            isNullable: true,
          },

          {
            name: 'atualizado_por',
            type: 'varchar',
            length: '30',
            isNullable: true,
          },

          {
            name: 'criado_em',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'atualizado_em',
            type: 'timestamp',
            isNullable: true,
            // default: 'now()',
          },
        ],

        foreignKeys: [
          {
            name: 'Emails',
            referencedTableName: 'sav2.emails',
            referencedColumnNames: ['id'],
            columnNames: ['id_email'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },

          {
            name: 'Grupos',
            referencedTableName: 'sav2.grupos',
            referencedColumnNames: ['id'],
            columnNames: ['id_grupo'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('sav2.grupos_emails');
  }
}
