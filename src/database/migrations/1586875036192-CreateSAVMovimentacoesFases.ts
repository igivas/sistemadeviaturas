import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateSAVMovimentacoesFases1586875036191
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'sav2.movimentacoes_fases',
        columns: [
          {
            name: 'id_movimentacao_fase',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
          },
          {
            name: 'id_movimentacao',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'id_tipo_fase',
            type: 'int',
            isNullable: false,
          },

          {
            name: 'id_next_tipo_fase',
            type: 'int',
            isNullable: true,
          },

          {
            name: 'obs',
            type: 'text',
            isNullable: true,
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
            name: 'VeiculosMovimentacaoes',
            referencedTableName: 'sav2.movimentacoes',
            referencedColumnNames: ['id_movimentacao'],
            columnNames: ['id_movimentacao'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'TipoMovimentacaoFase',
            referencedTableName: 'sav2.fases',
            referencedColumnNames: ['id_fase'],
            columnNames: ['id_tipo_fase'],
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
          {
            name: 'NextTipoMovimentacaoFase',
            referencedTableName: 'sav2.fases',
            referencedColumnNames: ['id_fase'],
            columnNames: ['id_next_tipo_fase'],
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('sav2.movimentacoes_fases', true);
  }
}
