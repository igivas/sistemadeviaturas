import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateSAVVeiculosPrefixos1586875036191
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'sav2.prefixos',
        columns: [
          {
            name: 'id_prefixo',
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
            name: 'prefixo_tipo',
            type: 'varchar',
            length: '2',
            isNullable: true,
          },

          {
            name: 'emprego',
            type: 'varchar',
            length: '2',
            isNullable: true,
          },

          {
            name: 'prefixo_sequencia',
            type: 'varchar',
            length: '6',
            isNullable: false,
          },

          /* {
            name: 'data_prefixo',
            type: 'date',
            isNullable: false,
          }, */

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
            name: 'VeiculosPrefixos',
            referencedTableName: 'sav2.veiculos',
            referencedColumnNames: ['id_veiculo'],
            columnNames: ['id_veiculo'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('sav2.prefixos');
  }
}
