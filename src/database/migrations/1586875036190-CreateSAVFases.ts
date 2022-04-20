import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateSAVFases1586875036190 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'sav2.fases',
        columns: [
          { name: 'id_fase', type: 'int', isPrimary: true, isGenerated: true },

          { name: 'nome_fase', type: 'varchar', isNullable: false },

          {
            name: 'criado_por',
            type: 'varchar',
            length: '30',
            isNullable: false,
          },

          { name: 'criado_em', type: 'timestamp', default: 'now()' },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('sav2.fases');
  }
}
