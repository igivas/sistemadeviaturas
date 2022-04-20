import { container, inject, injectable } from 'tsyringe';
import { IIdentificadoresRepository } from '@modules/veiculos/repositories/interfaces/IIdentificadoresRepository';
import { QueryRunner, getConnection } from 'typeorm';
import { compareAsc, format, parseISO } from 'date-fns';
import { AxiosError } from 'axios';
import { CreateIdentificadorSchema } from '../utils/createIdentificadorSchema';
import { IVeiculosIdentificadoresRepository } from '../repositories/interfaces/IVeiculosIdentificadoresRepository';
import Veiculo from '../entities/Veiculo';
import VeiculoIdenficador from '../entities/VeiculoIdentificador';

import Identificador from '../entities/Identificador';
import IVeiculosRepository from '../repositories/interfaces/IVeiculosRepository';
import AppError from '../../../errors/AppError';
import CoreEmail from './CoreEmail';
import { IGruposEmailsRepository } from '../repositories/interfaces/IGruposEmailsRepository';

@injectable()
class CoreIdentificador {
  constructor(
    @inject('VeiculosRepository')
    private veiculosRepository: IVeiculosRepository,

    @inject('IdentificadoresRepository')
    private identificadoresRepository: IIdentificadoresRepository,

    @inject('VeiculosIdentificadoresRepository')
    private veiculosIdentificadoresRepository: IVeiculosIdentificadoresRepository,

    @inject('GruposEmailsRepository')
    private gruposEmailsRepository: IGruposEmailsRepository,
  ) {}

  async setIdentificador(
    identificador: CreateIdentificadorSchema,
    criado_por: string,
    defaultQueryRunner?: QueryRunner,
    veiculoFormated?: Veiculo | string,
  ): Promise<any> {
    let identificadorResponse;

    let queryRunner;

    if (!defaultQueryRunner) {
      const connection = getConnection();
      queryRunner = connection.createQueryRunner();

      await queryRunner.connect();
      await queryRunner.startTransaction();
    } else queryRunner = defaultQueryRunner;

    const coreEmail = container.resolve(CoreEmail);

    const [
      gruposIdentificadores,
    ] = await this.gruposEmailsRepository.findAllByIdGrupo(1);

    const emails = gruposIdentificadores
      ?.filter(grupoIdentificador => grupoIdentificador.email.ativo === '1')
      .map(grupoIdentificador => grupoIdentificador.email.email);

    try {
      let veiculo;
      if (typeof veiculoFormated === 'string') {
        const id_veiculo = Number.parseInt(veiculoFormated.toString(), 10);

        if (Number.isNaN(id_veiculo)) throw new AppError('Veiculo Inválido');
        veiculo = await this.veiculosRepository.findById(id_veiculo.toString());

        if (!veiculo) throw new AppError('Veiculo Inválido');
      } else veiculo = veiculoFormated as Veiculo;

      const [
        olderIdentificador,
        veiculoIdentifcadorBeforeDate,
        veiculoIdentifcadorAfterDate,
      ] = await Promise.all([
        this.identificadoresRepository.findIdentificadorByIdentificador(
          identificador.identificador,
        ),
        this.veiculosIdentificadoresRepository.findVeiculoIdentificadorBeforeDateAndIdVeiculo(
          veiculo.id_veiculo,
          identificador.data_identificador as Date,
        ),
        this.veiculosIdentificadoresRepository.findVeiculoIdentificadorAfterDateAndIdVeiculo(
          veiculo.id_veiculo,
          identificador.data_identificador as Date,
        ),
      ]);

      let copyIdentificador;

      if (!olderIdentificador) {
        copyIdentificador = await this.identificadoresRepository.create(
          {
            identificador: identificador.identificador,
            criado_por,
          } as Identificador,
          queryRunner,
        );
      } else copyIdentificador = olderIdentificador;

      if (veiculoIdentifcadorAfterDate) {
        const identificadorBeforeDate = await this.identificadoresRepository.findById(
          veiculoIdentifcadorAfterDate.id_identificador,
        );

        switch (
          compareAsc(
            parseISO(
              veiculoIdentifcadorAfterDate?.data_identificador.toString() as string,
            ),
            identificador.data_identificador as Date,
          )
        ) {
          case 1:
            identificadorResponse = await this.veiculosIdentificadoresRepository.create(
              {
                ativo: '0',
                data_identificador: identificador.data_identificador as Date,
                id_veiculo: veiculo.id_veiculo,
                id_identificador: copyIdentificador.id_identificador,
                criado_por,
                observacao: identificador.observacao,
              } as VeiculoIdenficador,
              queryRunner,
            );
            break;

          default:
            if (veiculoIdentifcadorAfterDate?.ativo === '1') {
              await this.removeActiveLastIdentificadorByIdVeiculo(
                queryRunner,
                veiculoIdentifcadorAfterDate,
                criado_por,
              );
            }

            identificadorResponse = await this.veiculosIdentificadoresRepository.create(
              {
                ativo: '1',
                data_identificador: identificador.data_identificador as Date,
                id_veiculo: veiculo.id_veiculo,
                id_identificador: copyIdentificador.id_identificador,
                criado_por,
                observacao: identificador.observacao,
              } as VeiculoIdenficador,
              queryRunner,
            );

            await coreEmail.enviarEmail(
              'Identificador de Viatura Atualizado',
              `<p>O Sistema de Acompanhamento de Veiculos - SAV, registrou na data ${format(
                new Date(identificadorResponse.criado_em),
                'dd/MM/yyyy HH:mm:ss',
              )} que viatura de chassi ${veiculo.chassi} ${
                veiculo.placa ? `e  de placa ${veiculo.placa}` : ''
              } ${
                identificadorBeforeDate
                  ? `que antes possuía identificador ${identificadorBeforeDate.identificador}`
                  : ''
              } agora possui identificador ${
                copyIdentificador.identificador
              }</p>`,
              1,
            );
            break;
        }
      } else if (veiculoIdentifcadorBeforeDate) {
        if (veiculoIdentifcadorBeforeDate.ativo === '1') {
          await this.removeActiveLastIdentificadorByIdVeiculo(
            queryRunner,
            veiculoIdentifcadorBeforeDate,
            criado_por,
          );
        }

        identificadorResponse = await this.veiculosIdentificadoresRepository.create(
          {
            ativo: '1',
            data_identificador: identificador.data_identificador as Date,
            id_veiculo: veiculo.id_veiculo,
            id_identificador: copyIdentificador.id_identificador,
            criado_por,
            observacao: identificador.observacao,
          } as VeiculoIdenficador,
          queryRunner,
        );

        const identificadorBeforeDate = await this.identificadoresRepository.findById(
          veiculoIdentifcadorBeforeDate.id_identificador,
        );

        await coreEmail.enviarEmail(
          'Identificador de Viatura Atualizado',
          `<p>O Sistema de Acompanhamento de Veiculos - SAV, registrou na data ${format(
            new Date(identificadorResponse.criado_em),
            'dd/MM/yyyy HH:mm:ss',
          )}que viatura de chassi ${veiculo.chassi} ${
            veiculo.placa ? `e  de placa ${veiculo.placa}` : ''
          }, ${
            identificadorBeforeDate
              ? `que antes possuía identificador ${identificadorBeforeDate.identificador}`
              : ''
          } agora possui identificador ${copyIdentificador.identificador}</p>`,
          1,
        );
      } else {
        identificadorResponse = await this.veiculosIdentificadoresRepository.create(
          {
            ativo: '1',
            data_identificador: identificador.data_identificador as Date,
            id_veiculo: veiculo.id_veiculo,
            id_identificador: copyIdentificador.id_identificador,
            criado_por,
            observacao: identificador.observacao,
          } as VeiculoIdenficador,
          queryRunner,
        );

        await coreEmail.enviarEmail(
          'Identificador de Viatura Atualizado',
          `<p>O Sistema de Acompanhamento de Veiculos - SAV, registrou na data ${format(
            new Date(identificadorResponse.criado_em),
            'dd/MM/yyyy HH:mm:ss',
          )} que viatura de chassi ${veiculo.chassi} ${
            veiculo.placa ? `e  de placa ${veiculo.placa}` : ''
          } agora possui identificador ${copyIdentificador.identificador}</p>`,
          1,
        );
      }

      identificadorResponse = {
        ...identificadorResponse,
        success: `Identificador atualizado.${
          emails.length > 0
            ? `
          Foi enviado para os servidores da CETIC um pedido para que esta alteração fosse informada para os seguintes emails: ${
            emails.length > 1
              ? emails.join(',').replace(/,,/, '')
              : emails.join(',').replace(/,,/, '').replace(/,,/, ',')
          }
          `
            : ''
        }`,
      };

      if (!defaultQueryRunner) await queryRunner.commitTransaction();
    } catch (error) {
      if ((error as AxiosError).isAxiosError) {
        try {
          queryRunner.commitTransaction();

          identificadorResponse = {
            ...identificadorResponse,
            warning: `Identificador atualizado. ${
              emails.length > 0
                ? `Houve um erro no servidor de envio de emails, e portanto não foi enviado. Por favor, envie a informação desta mudanca para os emails a seguir: ${
                    emails.length > 1
                      ? emails.join(',').replace(/,,/, '')
                      : emails.join(',').replace(/,,/, '').replace(/,,/, ',')
                  }`
                : ''
            }`,
          };
        } catch (errorFindEmail) {
          queryRunner.rollbackTransaction();
          throw new AppError('Erro ao achar emails');
        }
      } else {
        await queryRunner.rollbackTransaction();
        throw new AppError('Não pode Inserir identificador');
      }
    } finally {
      if (!defaultQueryRunner) await queryRunner.release();
    }

    return identificadorResponse;
  }

  async removeActiveLastIdentificadorByIdVeiculo(
    queryRunner: QueryRunner,
    lastIdentificadorByVeiculo: VeiculoIdenficador,
    criado_por: string,
  ): Promise<VeiculoIdenficador | undefined> {
    return this.veiculosIdentificadoresRepository.update(
      lastIdentificadorByVeiculo,
      { ativo: '0', criado_por },
      queryRunner,
    );
  }
}

export default CoreIdentificador;
