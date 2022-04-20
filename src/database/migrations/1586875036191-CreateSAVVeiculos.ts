import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateSAVVeiculos1586875036191
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'sav2.veiculos',
        columns: [
          {
            name: 'id_veiculo',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
          },
          {
            name: 'id_veiculo_especie',
            type: 'int',
            isNullable: true,
          },

          {
            name: 'id_situacao_tipo',
            type: 'int',
            isNullable: true,
          },

          {
            name: 'id_situacao_especificacao_atual',
            type: 'int',
            isNullable: true,
          },

          {
            name: 'valor_fipe',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          },

          {
            name: 'orgao_tombo',
            type: 'int',
            isNullable: true,
          },

          {
            name: 'tombo',
            type: 'varchar',
            length: '11',
            isNullable: true,
            isUnique: true,
          },

          {
            name: 'is_reserva',
            type: 'varchar',
            length: '1',
            isNullable: true,
          },

          { name: 'id_marca', type: 'int', isNullable: true },

          { name: 'id_modelo', type: 'int', isNullable: true },

          { name: 'id_cor', type: 'int', isNullable: true },

          {
            name: 'ano_fabricacao',
            type: 'varchar',
            length: '4',
            isNullable: true,
          },

          {
            name: 'ano_modelo',
            type: 'varchar',
            length: '4',
            isNullable: true,
          },

          {
            name: 'placa',
            type: 'varchar',
            length: '7',
            isNullable: true,
            comment: 'Deve seguir o padrao XXX1234/XXX1X23',
          },

          {
            name: 'chassi',
            type: 'varchar',
            length: '18',
            isNullable: true,
            isUnique: true,
            comment:
              'Deve ter 17 caracteres entre numeros e letras onde:' +
              ' 1º Caractere: Regiao Geografica (A ao H - Africa, J ao R - Asia, S ao Z - Europa, 1 ao 5 - America do Norte, 6 e 7 - Oceania, 8 e 9 - America do Sul) / ' +
              '2º Caractere: Pais de origem / ' +
              '3º Caractere: Fabricante / ' +
              '4º - 9º Caractere: Modelo do Carro, Tipo, tamanho da carroceria / ' +
              '10º Caractere: Ano do Modelo / ' +
              '11º - 17º Caracteres - Local de Fabricacao e numero de producao sequencial',
          },

          {
            name: 'numero_motor',
            type: 'varchar',
            length: '20',
            isNullable: true,
            isUnique: true,
          },

          {
            name: 'renavam',
            type: 'varchar',
            length: '11',
            isNullable: true,
          },

          {
            name: 'numero_crv',
            type: 'varchar',
            length: '15',
            isNullable: true,
          },
          {
            name: 'codigo_seguranca_crv',
            type: 'varchar',
            length: '15',
            isNullable: true,
            isUnique: true,
            comment: 'Presente apenas nos Veiculos depois de 2007',
          },

          {
            name: 'uf',
            type: 'varchar',
            length: '2',
            isNullable: true,
          },

          {
            name: 'combustivel',
            type: 'varchar',
            length: '1',
            isNullable: true,
          },

          {
            name: 'data_operacao',
            type: 'date',
            isNullable: true,
          },

          {
            name: 'tipo_doc_carga',
            type: 'varchar',
            length: '1',
            isNullable: true,
          },

          {
            name: 'numero_doc_carga',
            type: 'varchar',
            length: '4',
            isNullable: true,
          },

          {
            name: 'data_doc_carga',
            type: 'date',
            isNullable: true,
          },

          {
            name: 'observacao',
            type: 'text',
            isNullable: true,
          },

          { name: 'localizacao_externa', type: 'int', isNullable: true },
          { name: 'adesivado', type: 'varchar', length: '3', isNullable: true },

          { name: 'km_troca_pneus', type: 'int', isNullable: true },

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
          // {
          //   name: 'VeiculosLocalExterno',
          //   referencedTableName: 'locais_externos',
          //   referencedColumnNames: ['id_local_externo'],
          //   columnNames: ['localizacao_externa'],
          //   onDelete: 'SET NULL',
          //   onUpdate: 'CASCADE',
          // },
          {
            name: 'Uf',
            referencedTableName: 'public.uf',
            referencedColumnNames: ['uf_codigo'],
            columnNames: ['uf'],
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
          },

          {
            name: 'VeiculosEspecies',
            referencedTableName: 'sav2.veiculos_especies',
            referencedColumnNames: ['id_veiculo_especie'],
            columnNames: ['id_veiculo_especie'],
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
          },
          {
            name: 'VeiculosCores',
            referencedTableName: 'sav2.veiculos_cores',
            referencedColumnNames: ['id_cor'],
            columnNames: ['id_cor'],
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
          },
          {
            name: 'VeiculosMarcas',
            referencedTableName: 'sav2.veiculos_marcas',
            referencedColumnNames: ['id_veiculo_marca'],
            columnNames: ['id_marca'],
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
          },
          {
            name: 'VeiculosOrgaos',
            referencedTableName: 'sav2.orgaos',
            referencedColumnNames: ['id_orgao'],
            columnNames: ['orgao_tombo'],
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
          },

          {
            name: 'VeiculoModelos',
            referencedTableName: 'sav2.veiculos_modelos',
            referencedColumnNames: ['id_veiculo_modelo'],
            columnNames: ['id_modelo'],
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
          },

          {
            name: 'VeiculoSituacaoTipoAtual',
            referencedTableName: 'sav2.situacoes_tipos',
            referencedColumnNames: ['id_situacao_tipo'],
            columnNames: ['id_situacao_tipo'],
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
          },

          {
            name: 'VeiculoSituacaoTipoEspecificoAtual',
            referencedTableName: 'sav2.situacoes_tipos_especificacoes',
            referencedColumnNames: ['id_situacao_especificacao'],
            columnNames: ['id_situacao_especificacao_atual'],
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('sav2.veiculos');
  }
}
