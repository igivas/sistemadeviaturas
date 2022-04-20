import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateSAVEmails1625838139461
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'sav2.emails',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            isUnique: true,
          },

          {
            name: 'id_email',
            type: 'uuid',
            isPrimary: true,
          },

          {
            name: 'email',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },

          {
            name: 'is_active',
            type: 'varchar',
            length: '1',
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
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('sav2.emails');
  }
}
