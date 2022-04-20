import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateSAVTiposMovimentacoes1586875036191
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'sav2.tipos_movimentacoes',
        columns: [
          {
            name: 'id_tipo_movimentacao',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
          },
          {
            name: 'tipo_movimentacao',
            type: 'varchar',
            length: '20',
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
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('sav2.tipos_movimentacoes', true);
  }
}
