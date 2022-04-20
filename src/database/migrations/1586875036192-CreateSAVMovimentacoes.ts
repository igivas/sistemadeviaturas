import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateSAVMovimentacoes1586875036191
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'sav2.movimentacoes',
        columns: [
          {
            name: 'id_movimentacao',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
          },
          {
            name: 'id_veiculo',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'tipo_movimentacao',
            type: 'int',
            isNullable: false,
          },

          {
            name: 'data_movimentacao',
            type: 'timestamp',
          },

          {
            name: 'id_documento_sga',
            type: 'int',
            isNullable: true,
          },

          {
            name: 'url_documento_sga',
            type: 'varchar',
            isNullable: true,
          },

          {
            name: 'id_documento_devolucao_sga',
            type: 'int',
            isNullable: true,
          },

          {
            name: 'url_documento_devolucao_sga',
            type: 'varchar',
            isNullable: true,
          },

          {
            name: 'tipo_doc',
            type: 'varchar',
            length: '1',
            isNullable: true,
          },

          {
            name: 'observacao',
            type: 'varchar',
            isNullable: true,
          },

          {
            name: 'numero_doc',
            type: 'varchar',
            length: '3',
            isNullable: true,
          },

          {
            name: 'data_doc',
            type: 'date',
            isNullable: true,
          },

          {
            name: 'data_envio',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'data_retorno',
            type: 'date',
            isNullable: true,
          },

          {
            name: 'previsao_retorno',
            type: 'date',
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
        foreignKeys: [
          {
            name: 'VeiculosIdentificadores',
            referencedTableName: 'sav2.veiculos',
            referencedColumnNames: ['id_veiculo'],
            columnNames: ['id_veiculo'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'TiposMovimentacoes',
            referencedTableName: 'sav2.tipos_movimentacoes',
            referencedColumnNames: ['id_tipo_movimentacao'],
            columnNames: ['tipo_movimentacao'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('sav2.movimentacoes');
  }
}
