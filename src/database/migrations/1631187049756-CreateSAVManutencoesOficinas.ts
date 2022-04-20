import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateSAVManutencoesOficinas1631187049756
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'sav2.manutencoes_oficinas',
        columns: [
          {
            name: 'id_manutencao_localizacao',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            isUnique: true,
          },

          {
            name: 'id_manutencao',
            type: 'int',
            isNullable: false,
          },

          {
            name: 'id_oficina',
            type: 'int',
            isNullable: false,
          },

          {
            name: 'data_manutencao_oficina',
            type: 'timestamp',
            isNullable: false,
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
            name: 'Oficina',
            referencedTableName: 'sav2.oficinas',
            referencedColumnNames: ['id'],
            columnNames: ['id_oficina'],
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
          },

          {
            name: 'Manutencao',
            referencedTableName: 'sav2.movimentacoes_manutencoes',
            referencedColumnNames: ['id'],
            columnNames: ['id_manutencao'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('sav2.manutencoes_oficinas');
  }
}
