import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateSAVEstoquePneus1586875036192
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'sav2.estoque_pneus',
        columns: [
          {
            name: 'id_estoque_pneu',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
          },
          {
            name: 'id_referencia_pneu',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'qtd_movimentada',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'tipo_movimentacao',
            type: 'varchar',
            length: '1',
            isNullable: false,
          },
          {
            name: 'saldo_estoque',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'id_nf',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'id_solicitacao',
            type: 'int',
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
            name: 'EstoquePneusNF',
            referencedTableName: 'sav2.notas_fiscais',
            referencedColumnNames: ['id_nf'],
            columnNames: ['id_nf'],
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
          },
          {
            name: 'EstoquePneusReferencias',
            referencedTableName: 'sav2.referencia_pneus',
            referencedColumnNames: ['id_referencia_pneu'],
            columnNames: ['id_referencia_pneu'],
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('sav2.estoque_pneus');
  }
}
