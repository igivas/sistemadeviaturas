import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateSAVSolicitacoesPneus1586875036191
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'sav2.solicitacoes_pneus',
        columns: [
          {
            name: 'id_solicitacao_pneu',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
          },
          {
            name: 'id_opm_solicitante',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'id_pm_solicitante',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'qtd_solicitada',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'id_referencia_pneu',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'id_veiculo',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'ultimo_km',
            type: 'int',
            isNullable: true,
          },

          {
            name: 'justificativa',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'solicitacao_path',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },

          {
            name: 'justificativa_path',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'laudo_twi_path',
            type: 'varchar',
            length: '255',
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
            name: 'SolicitacoesPneusVeiculos',
            referencedTableName: 'sav2.veiculos',
            referencedColumnNames: ['id_veiculo'],
            columnNames: ['id_veiculo'],
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
          },
          {
            name: 'SolicitacoesPneusReferencias',
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
    await queryRunner.dropTable('sav2.solicitacoes_pneus');
  }
}
