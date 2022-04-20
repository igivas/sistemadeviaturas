import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateSAVVeiculosSituacoes1586875036192
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'sav2.situacoes_veiculos',
        columns: [
          {
            name: 'id_situacao_veiculo',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
          },
          {
            name: 'id_situacao_tipo',
            type: 'int',
            isNullable: false,
          },

          {
            name: 'id_situacao_tipo_especificacao',
            type: 'int',
            isNullable: true,
          },

          {
            name: 'id_veiculo',
            type: 'int',
            isNullable: false,
          },

          {
            name: 'id_km',
            type: 'int',
            isNullable: true,
          },

          {
            name: 'data_situacao',
            type: 'date',
            isNullable: true,
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
            name: 'VeiculosSituacoes',
            referencedTableName: 'sav2.veiculos',
            referencedColumnNames: ['id_veiculo'],
            columnNames: ['id_veiculo'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'SituacoesTipos',
            referencedTableName: 'sav2.situacoes_tipos',
            referencedColumnNames: ['id_situacao_tipo'],
            columnNames: ['id_situacao_tipo'],
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
          },

          {
            name: 'SituacaoTipoEspecificacao',
            referencedTableName: 'sav2.situacoes_tipos_especificacoes',
            referencedColumnNames: ['id_situacao_especificacao'],
            columnNames: ['id_situacao_tipo_especificacao'],
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
          },

          {
            name: 'SituacoesKms',
            referencedTableName: 'sav2.kms',
            referencedColumnNames: ['id_km'],
            columnNames: ['id_km'],
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('sav2.situacoes_veiculos');
  }
}
