import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateSAVKms1586875036191 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'sav2.kms',
        columns: [
          {
            name: 'id_km',
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
            name: 'km_atual',
            type: 'int',
            isNullable: false,
          },

          {
            name: 'data_km',
            type: 'timestamp',
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
            name: 'VeiculosKms',
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
    await queryRunner.dropTable('sav2.kms');
  }
}
