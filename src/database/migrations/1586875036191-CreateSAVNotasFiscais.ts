import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateSAVNotasFiscais1586875036191
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'sav2.notas_fiscais',
        columns: [
          {
            name: 'id_nf',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
          },
          {
            name: 'numero_doc_aquisicao',
            type: 'varchar',
            length: '10',
            isNullable: false,
          },
          {
            name: 'empenho_numero',
            type: 'varchar',
            length: '5',
            isNullable: false,
          },
          {
            name: 'empenho_ano',
            type: 'varchar',
            length: '4',
            isNullable: false,
          },

          {
            name: 'nf_numero',
            type: 'varchar',
            length: '10',
            isNullable: false,
          },
          {
            name: 'nf_foto',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'data_entrada',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'data_emissao',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'obs',
            type: 'varchar',
            isNullable: true,
          },

          {
            name: 'id_veiculo_especie',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'empresa_nome',
            type: 'varchar',
            length: '60',
            isNullable: false,
          },
          {
            name: 'empresa_endereco',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'empresa_cnpj',
            type: 'varchar',
            length: '14',
            isNullable: false,
          },

          {
            name: 'empresa_email',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },

          {
            name: 'empresa_telefone',
            type: 'varchar',
            length: '10',
            isNullable: true,
          },

          {
            name: 'empresa_celular',
            type: 'varchar',
            length: '11',
            isNullable: true,
          },

          {
            name: 'valor_total',
            type: 'decimal',
            precision: 12,
            scale: 2,
            isNullable: true,
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
            isNullable: false,
          },

          {
            name: 'criado_em',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'atualizado_em',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('sav2.notas_fiscais');
  }
}
