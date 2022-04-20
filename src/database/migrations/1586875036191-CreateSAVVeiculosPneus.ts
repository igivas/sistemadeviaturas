import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateSAVVeiculosPneus1586875036191
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'sav2.veiculos_pneus',
        columns: [
          {
            name: 'id_veiculos_pneus',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
          },
          {
            name: 'id_veiculo',
            type: 'int',
            isNullable: false,
          },

          { name: 'id_referencia_pneu', type: 'int', isNullable: false },

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

          {
            name: 'atualizado_por',
            type: 'varchar',
            length: '30',
            isNullable: true,
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
            name: 'VeiculosPneus',
            referencedTableName: 'sav2.veiculos',
            referencedColumnNames: ['id_veiculo'],
            columnNames: ['id_veiculo'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'VeiculosPneusReferencia',
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
    await queryRunner.dropTable('sav2.veiculos_pneus');
  }
}
