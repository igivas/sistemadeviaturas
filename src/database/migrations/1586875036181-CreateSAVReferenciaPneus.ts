import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateSAVReferenciaPneus1586875036191
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'sav2.referencia_pneus',
        columns: [
          {
            name: 'id_referencia_pneu',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
          },
          {
            name: 'descricao',
            type: 'varchar',
            length: '15',
            isNullable: true,
          },
          {
            name: 'id_veiculo_especie',
            type: 'int',
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
            name: 'VeiculosEspecies',
            referencedTableName: 'sav2.veiculos_especies',
            referencedColumnNames: ['id_veiculo_especie'],
            columnNames: ['id_veiculo_especie'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('sav2.referencia_pneus');
  }
}
