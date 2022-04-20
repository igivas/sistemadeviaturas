import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateSAVDadosMovimentacaoMudancaVeiculo1615810204552
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'sav2.dados_movimentacoes_mudancas_veiculos',
        columns: [
          {
            name: 'id_dado_movimentacao_mudanca',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
          },

          {
            name: 'id_movimentacao',
            type: 'int',
            isNullable: false,
          },

          {
            name: 'id_opm_origem',
            type: 'int',
            isNullable: false,
          },

          {
            name: 'assinado_origem',
            type: 'varchar',
            length: '1',
          },

          {
            name: 'assinado_devolucao_origem',
            type: 'varchar',
            length: '1',
            isNullable: true,
          },

          {
            name: 'assinado_devolucao_origem_por',
            type: 'varchar',
            length: '30',
            isNullable: true,
          },

          {
            name: 'assinado_por',
            type: 'varchar',
            length: '30',
            isNullable: true,
          },

          {
            name: 'autoridade_origem',
            type: 'varchar',
            isNullable: true,
          },
        ],
        foreignKeys: [
          {
            name: 'VeiculosMovimentacaoes',
            referencedTableName: 'sav2.movimentacoes',
            referencedColumnNames: ['id_movimentacao'],
            columnNames: ['id_movimentacao'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('sav2.dados_movimentacoes_mudancas_veiculos');
  }
}
