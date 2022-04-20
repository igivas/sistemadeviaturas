import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateSAVVeiculoCargaTransferência1615732934086
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'sav2.veiculos_carga_transferência',
        columns: [
          {
            name: 'id_carga',
            type: 'int',
            isNullable: false,
            isPrimary: true,
            isGenerated: true,
          },

          { name: 'id_veiculo', type: 'int', isNullable: true },

          { name: 'opm_carga', type: 'int', isNullable: true },

          {
            name: 'opm_carga_lob',
            type: 'varchar',
            length: '4',
            isNullable: true,
          },

          {
            name: 'data_carga',
            type: 'timestamp',
            isNullable: true,
            // default: 'now()',
          },

          {
            name: 'opm_carga_sigla',
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
            name: 'criado_por',
            type: 'varchar',
            length: '30',
            isNullable: false,
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
            name: 'VeiculosCarga',
            referencedTableName: 'sav2.veiculos',
            referencedColumnNames: ['id_veiculo'],
            columnNames: ['id_veiculo'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },

          {
            name: 'VeiculoOpm',
            referencedTableName: 'public.unidade',
            referencedColumnNames: ['uni_codigo'],
            columnNames: ['opm_carga'],
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('sav2.veiculos_carga_transferência');
  }
}
