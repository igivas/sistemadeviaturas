import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateSAVSituacoesEspecificoes1586875036191
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'sav2.situacoes_tipos_especificacoes',
        columns: [
          {
            name: 'id_situacao_especificacao',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
          },

          {
            name: 'id_situacao_tipo',
            type: 'int',
          },

          {
            name: 'especificacao',
            type: 'varchar',
            length: '60',
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
            name: 'SituacaoTipoEspecificao',
            referencedTableName: 'sav2.situacoes_tipos',
            referencedColumnNames: ['id_situacao_tipo'],
            columnNames: ['id_situacao_tipo'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('sav2.situacoes_tipos_especificacoes');
  }
}
