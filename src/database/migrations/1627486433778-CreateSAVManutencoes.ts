import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateSAVManutencoes1627486433778
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'sav2.movimentacoes_manutencoes',
        columns: [
          {
            name: 'id_manutencao',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            isUnique: true,
          },

          {
            name: 'id_dado_movimentacao_mudanca',
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
            name: 'DadoMovimentacaoTransferencia',
            referencedTableName: 'sav2.dados_movimentacoes_mudancas_veiculos',
            referencedColumnNames: ['id_dado_movimentacao_mudanca'],
            columnNames: ['id_dado_movimentacao_mudanca'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('sav2.movimentacoes_manutencoes');
  }
}
