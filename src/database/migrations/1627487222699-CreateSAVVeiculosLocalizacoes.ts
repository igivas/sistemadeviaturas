import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateSAVManutencoesLocalizacao1627487222699
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'sav2.veiculos_localizacoes',
        columns: [
          {
            name: 'id_localizacao',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
          },

          {
            name: 'id_veiculo',
            type: 'int',
          },

          {
            name: 'localizacao',
            type: 'varchar',
            isNullable: true,
            length: '255',
            comment: 'Este campo é para dizer a localizacao do veiculo',
          },

          {
            name: 'data_localizacao',
            type: 'timestamp',
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
            name: 'VeiculosLocalizacoes',
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
    await queryRunner.dropTable('sav2.veiculos_localizacoes');
  }
}
