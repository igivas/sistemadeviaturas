import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateSAVNFPneus1586875036192
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'sav2.nf_pneus',
        columns: [
          {
            name: 'id_nf_pneu',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
          },
          {
            name: 'id_nf',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'id_referencia_pneu',
            type: 'int',
            isNullable: false,
          },

          {
            name: 'qtd_pneus',
            type: 'int',
            isNullable: false,
          },

          {
            name: 'valor_unitario',
            type: 'decimal',
            precision: 8,
            scale: 2,
            isNullable: false,
          },

          {
            name: 'valor_total',
            type: 'decimal',
            precision: 10,
            scale: 2,
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
            name: 'NF_Pneus',
            referencedTableName: 'sav2.notas_fiscais',
            referencedColumnNames: ['id_nf'],
            columnNames: ['id_nf'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('sav2.nf_pneus');
  }
}
