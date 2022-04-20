import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateSAVMovimentacoesTransferencias1615810561908
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'sav2.movimentacoes_transferencias',
        columns: [
          {
            name: 'id_movimentacao_transferencia',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
          },

          {
            name: 'id_dado_movimentacao_mudanca',
            type: 'int',
            isNullable: false,
          },

          {
            name: 'id_opm_destino',
            type: 'int',
            isNullable: true,
          },

          {
            name: 'assinado_destino',
            type: 'varchar',
            length: '1',
          },

          {
            name: 'assinado_devolucao_destino',
            type: 'varchar',
            length: '1',
            isNullable: true,
          },

          {
            name: 'assinado_devolucao_destino_por',
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
            name: 'autoridade_destino',
            type: 'varchar',
            isNullable: true,
          },

          {
            name: 'justificativa',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
        ],
        foreignKeys: [
          {
            name: 'DadoMovimentacaoTransferencia',
            referencedTableName: 'sav2.dados_movimentacoes_mudancas_veiculos',
            referencedColumnNames: ['id_dado_movimentacao_mudanca'],
            columnNames: ['id_dado_movimentacao_mudanca'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('sav2.movimentacoes_transferencias');
  }
}
