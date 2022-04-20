import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateSAVVeiculosModelos1586875036191
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'sav2.veiculos_modelos',
        columns: [
          {
            name: 'id_veiculo_modelo',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
          },
          {
            name: 'id_veiculo_marca',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'id_veiculo_especie',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'nome',
            type: 'varchar',
            length: '40',
            isNullable: false,
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
            name: 'VeiculoMarca',
            referencedTableName: 'sav2.veiculos_marcas',
            referencedColumnNames: ['id_veiculo_marca'],
            columnNames: ['id_veiculo_marca'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'VeiculoEspecie',
            referencedTableName: 'sav2.veiculos_especies',
            referencedColumnNames: ['id_veiculo_especie'],
            columnNames: ['id_veiculo_especie'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('sav2.veiculos_modelos');
  }
}
