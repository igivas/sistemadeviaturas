import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateSAVOficinas1627123928103
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'sav2.oficinas',
        columns: [
          {
            name: 'id_oficina',
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
            name: 'nome',
            type: 'varchar',
            isNullable: false,
          },

          {
            name: 'id_oficina_pai',
            type: 'int',
            isNullable: true,
            comment: 'Id da oficina superior',
          },

          {
            name: 'cpf_cnpj',
            type: 'varchar',
            length: '14',
            isNullable: true,
          },

          {
            name: 'id_municipio',
            type: 'varchar',
            length: '6',
            isNullable: false,
          },

          {
            name: 'ativo',
            type: 'varchar',
            length: '1',
            isNullable: false,
          },

          {
            name: 'cep',
            type: 'varchar',
            length: '10',
            isNullable: true,
          },

          {
            name: 'endereco',
            type: 'varchar',
            length: '80',
            isNullable: false,
          },

          {
            name: 'numero',
            type: 'varchar',
            length: '6',
            isNullable: false,
          },

          {
            name: 'endereco_complemento',
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
            name: 'IdOficinaOrigem',
            referencedTableName: 'sav2.oficinas',
            referencedColumnNames: ['id'],
            columnNames: ['id_oficina_pai'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },

          {
            name: 'Municipios',
            referencedTableName: 'public.municipio',
            referencedColumnNames: ['mun_codigo'],
            columnNames: ['id_municipio'],
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('sav2.oficinas');
  }
}
