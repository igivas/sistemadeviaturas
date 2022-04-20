import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateSAVVeiculosIdentificadores1615298250902
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'sav2.veiculos_identificadores',
        columns: [
          {
            name: 'id_veiculo_idenficador',
            type: 'int',
            isNullable: false,
            isPrimary: true,
            isGenerated: true,
          },

          {
            name: 'id_veiculo',
            type: 'int',
            isNullable: false,
          },

          {
            name: 'id_identificador',
            type: 'int',
            isNullable: false,
          },

          {
            name: 'observacao',
            type: 'varchar',
            isNullable: true,
          },

          {
            name: 'data_identificador',
            type: 'date',
            isNullable: true,
          },

          {
            name: 'ativo',
            type: 'varchar',
            length: '1',
            isNullable: false,
            default: '1',
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
            name: 'VeiculosIdentificadores',
            referencedTableName: 'sav2.veiculos',
            referencedColumnNames: ['id_veiculo'],
            columnNames: ['id_veiculo'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'IdentificadoresVeiculos',
            referencedTableName: 'sav2.identificadores',
            referencedColumnNames: ['id_identificador'],
            columnNames: ['id_identificador'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('veiculos_identificadores');
  }
}
