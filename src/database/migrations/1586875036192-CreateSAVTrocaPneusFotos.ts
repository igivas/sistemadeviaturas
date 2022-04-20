import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateSAVTrocaPneusFotos1586875036192
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'sav2.troca_pneus_fotos',
        columns: [
          {
            name: 'id_troca_pneu_foto',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
          },
          {
            name: 'id_troca_pneu',
            type: 'int',
            isNullable: false,
          },

          {
            name: 'path',
            type: 'varchar',
            isNullable: false,
          },

          {
            name: 'extensao',
            type: 'varchar',
            length: '3',
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
        foreignKeys: [
          {
            name: 'TrocaPneus_Fotos',
            referencedTableName: 'sav2.troca_pneus',
            referencedColumnNames: ['id_troca_pneu'],
            columnNames: ['id_troca_pneu'],
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('sav2.troca_pneus_fotos');
  }
}
