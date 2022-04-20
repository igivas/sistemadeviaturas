import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateSAVVeiculosAquisicao1586875036192
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'sav2.aquisicoes',
        columns: [
          {
            name: 'id_aquisicao',
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
            name: 'origem_aquisicao',
            type: 'varchar',
            length: '1',
            isNullable: true,
            comment: '0 - organico / 1 - Locado / 2 - Cedido',
          },

          {
            name: 'forma_aquisicao',
            type: 'varchar',
            length: '1',
            isNullable: true,
            comment:
              'Presente apenas em caso de organico. Possiveis valores: 0 - compra / 1 - doacao',
          },

          {
            name: 'valor_aquisicao',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
            comment: 'Presente apenas no caso de organico',
          },

          {
            name: 'id_orgao_aquisicao',
            type: 'int',
            isNullable: true,
            comment: 'Presente nos casos organicos ou cedidos',
          },

          {
            name: 'data_aquisicao',
            type: 'date',
            isNullable: true,
          },

          {
            name: 'doc_aquisicao',
            type: 'varchar',
            isNullable: true,
          },

          {
            name: 'criado_por',
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

          {
            name: 'file_path',
            type: 'varchar',
            isNullable: true,
          },
        ],
        foreignKeys: [
          {
            name: 'VeiculosAquisicao',
            referencedTableName: 'sav2.veiculos',
            referencedColumnNames: ['id_veiculo'],
            columnNames: ['id_veiculo'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },

          {
            name: 'VeiculosOrgaos',
            referencedTableName: 'sav2.orgaos',
            referencedColumnNames: ['id_orgao'],
            columnNames: ['id_orgao_aquisicao'],
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('sav2.aquisicoes');
  }
}
