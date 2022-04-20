import { injectable, inject } from 'tsyringe';
import IPessoasFisicasPmsRepository from '@modules/public/repositories/interfaces/IPessoasFisicasPmsRepository';
import IUsuariosRepository from '@modules/seg/repositories/interfaces/IUsuariosRepository';
import PessoaFisicaPm from '@modules/public/entities/PessoaFisicaPm';
import Usuario from '@modules/seg/entities/Usuario';
import EGraduacao from '@modules/public/enums/EGraduacao';
import { isDate, parseISO, compareAsc } from 'date-fns';
import AppError from '../../../errors/AppError';
import IKmsRepository from '../repositories/interfaces/IKmsRepository';
import { IPostKm } from '../interfaces/request/IPostKm';
import Km from '../entities/Km';
import IVeiculosRepository from '../repositories/interfaces/IVeiculosRepository';
import EEspecieVeiculo from '../enums/EEspecieVeiculo';
import { IGetKms } from '../interfaces/request/IGetKms';
import { IResponseKms } from '../interfaces/response/IResponseKm';

@injectable()
class CoreKm {
  constructor(
    @inject('KmsRepository')
    private kmsRepository: IKmsRepository,

    @inject('VeiculosRepository')
    private veiculosRepository: IVeiculosRepository,

    @inject('PessoasFisicasPmsPublicRepository')
    private pessoaRepository: IPessoasFisicasPmsRepository,

    @inject('UsuariosRepository')
    private usuariosRepository: IUsuariosRepository,
  ) {}

  async create(kmToInsert: IPostKm): Promise<Km> {
    const veiculo = await this.veiculosRepository.findById(
      kmToInsert.id_veiculo,
    );

    if (!veiculo) throw new AppError('Veiculo não encontrado');

    const [kmBeforeDate, kmAfterDate] = await Promise.all([
      this.findVeiculoKmBeforeDate(veiculo.id_veiculo, kmToInsert.data_km),
      this.findVeiculoKmAfterDate(veiculo.id_veiculo, kmToInsert.data_km),
    ]);

    if (kmBeforeDate) {
      if (
        compareAsc(new Date(kmBeforeDate.data_km), kmToInsert.data_km) >= 0 &&
        kmBeforeDate.km_atual > kmToInsert.km_atual
      ) {
        throw new AppError(
          `Km atual menor que o km inserido na data ${kmBeforeDate.data_km}`,
        );
      } else if (
        compareAsc(new Date(kmBeforeDate.data_km), kmToInsert.data_km) < 0 &&
        kmBeforeDate.km_atual > kmToInsert.km_atual
      ) {
        throw new AppError(
          `Km atual menor que o km inserido na data ${kmBeforeDate.data_km}`,
        );
      } else if (
        !!this.canResetKm(kmBeforeDate.km_atual, veiculo.id_veiculo_especie) ===
        !!(kmBeforeDate.km_atual > kmToInsert.km_atual)
      )
        throw new AppError(
          `Km atual maior que o km inserido na data ${kmBeforeDate.data_km}`,
        );
    }

    if (kmAfterDate && kmAfterDate.km_atual < kmToInsert.km_atual)
      throw new AppError(
        `Km atual maior que o km inserido que a data ${kmAfterDate.data_km}`,
      );

    return this.kmsRepository.create({
      data_km: kmToInsert.data_km,
      id_veiculo: veiculo.id_veiculo,
      criado_por: kmToInsert.criado_por,
      km_atual: kmToInsert.km_atual,
    } as Km);
  }

  canResetKm(km_atual: number, veiculoEspecie: EEspecieVeiculo): boolean {
    const kmResetaHodometroMotocicleta = 99400;

    return veiculoEspecie === EEspecieVeiculo.Motocicleta
      ? km_atual < kmResetaHodometroMotocicleta
      : km_atual <
          Math.floor(Math.round(kmResetaHodometroMotocicleta * 10.058));
  }

  async findVeiculoKmBeforeDate(
    id_veiculo: number,
    data_km: Date,
  ): Promise<Km | undefined> {
    if (Number.isNaN(id_veiculo)) throw new AppError('Id veiculo invalido');

    if (!isDate(parseISO(data_km?.toString())))
      throw new AppError('Data invalida');

    return this.kmsRepository.findKmVeiculoBeforeDate(id_veiculo, data_km);
  }

  async findVeiculoKmAfterDate(
    id_veiculo: number,
    data_km: Date,
  ): Promise<Km | undefined> {
    if (Number.isNaN(id_veiculo)) throw new AppError('Id veiculo invalido');

    if (!isDate(parseISO(data_km.toString())))
      throw new AppError('Data invalida');

    return this.kmsRepository.findKmVeiculoAfterDate(id_veiculo, data_km);
  }

  async list({ id, page, perPage }: IGetKms): Promise<IResponseKms> {
    const id_veiculo = Number.parseInt(id, 10);

    const formatedPage = page ? Number.parseInt(page, 10) : undefined;
    const formatedPerPage = perPage ? Number.parseInt(perPage, 10) : undefined;

    if (Number.isNaN(id_veiculo)) throw new AppError('Id do veiculo invalido');

    if (formatedPage && Number.isNaN(formatedPage))
      throw new AppError('Valor invalido de pagina');

    if (formatedPerPage && Number.isNaN(formatedPerPage))
      throw new AppError('Valor invalido de Quantidade');

    let [kms, total] = await this.kmsRepository.findKms(
      id_veiculo,
      formatedPage,
      formatedPerPage,
    );

    kms = await Promise.all(
      kms.map(async km => {
        const usuarioCriacao =
          km.criado_por.length < 9
            ? await this.pessoaRepository.findById(km.criado_por)
            : await this.usuariosRepository.findById(km.criado_por);

        return {
          ...km,
          criado_por:
            km.criado_por.length < 9
              ? `${
                  EGraduacao[(usuarioCriacao as PessoaFisicaPm).gra_codigo]
                } PM ${(usuarioCriacao as PessoaFisicaPm).pessoa?.pes_nome}`
              : `CIVIL ${(usuarioCriacao as Usuario).usu_nome}`,
        };
      }),
    );

    return {
      total,
      totalPage: Math.ceil(total / Number(formatedPerPage)),
      items: kms,
    };
  }
}

export default CoreKm;
