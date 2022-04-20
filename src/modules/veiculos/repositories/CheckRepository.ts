import { getRepository, LessThanOrEqual, Raw, Repository } from 'typeorm';
import Prefixo from '../entities/Prefixo';
import Veiculo from '../entities/Veiculo';
import ICheckRepository from './interfaces/ICheckRepository';
import Identificador from '../entities/Identificador';
import VeiculoIdenficador from '../entities/VeiculoIdentificador';

type PickUndefined<T, K extends keyof T> = {
  [P in K]?: T[P] | null;
};

type CheckPrefixo = {
  prefixo_tipo?: string;
  prefixo_sequencia: string;
};

class CheckRepository implements ICheckRepository {
  private prefixoRepository: Repository<Prefixo>;

  private veiculoRepository: Repository<Veiculo>;

  private identificadorRepository: Repository<Identificador>;

  private veiculosIdentificadoresRepository: Repository<VeiculoIdenficador>;

  constructor() {
    this.prefixoRepository = getRepository(Prefixo);
    this.veiculoRepository = getRepository(Veiculo);
    this.identificadorRepository = getRepository(Identificador);
    this.veiculosIdentificadoresRepository = getRepository(VeiculoIdenficador);
  }

  async checkPrefixo({
    prefixo_sequencia,
    prefixo_tipo,
  }: CheckPrefixo): Promise<Prefixo | undefined> {
    return this.prefixoRepository.findOne({
      select: ['id_prefixo', 'prefixo_sequencia', 'prefixo_tipo', 'emprego'],
      where: prefixo_tipo
        ? [
            {
              prefixo_tipo,
              prefixo_sequencia,
            },
            { prefixo_sequencia },
          ]
        : [{ prefixo_sequencia }],
      relations: ['veiculo'],
    });
  }

  async checkVeiculo({
    chassi,
    placa,
    numero_crv,
    renavam,
    codigo_seguranca_crv,
  }: PickUndefined<
    Veiculo,
    'chassi' | 'placa' | 'numero_crv' | 'renavam' | 'codigo_seguranca_crv'
  >): Promise<Veiculo | undefined> {
    const veiculos = await this.veiculoRepository.findOne({
      select: [
        'chassi',
        'placa',
        'numero_crv',
        'renavam',
        'codigo_seguranca_crv',
      ],
      where: [
        {
          chassi: chassi
            ? Raw(chassiDB => `LOWER(${chassiDB}) ILIKE LOWER('${chassi}')`)
            : undefined,
        },
        {
          placa: placa
            ? Raw(placaDB => `LOWER(${placaDB}) ILIKE LOWER('${placa}')`)
            : undefined,
        },
        {
          numero_crv: numero_crv
            ? Raw(
                numero_crvDB =>
                  `LOWER(${numero_crvDB}) ILIKE LOWER('${numero_crv}')`,
              )
            : undefined,
        },
        {
          codigo_seguranca_crv: codigo_seguranca_crv
            ? Raw(
                codigoSegurancaCrvDB =>
                  `LOWER(${codigoSegurancaCrvDB}) ILIKE LOWER('${codigo_seguranca_crv}')`,
              )
            : undefined,
        },
        {
          renavam: renavam
            ? Raw(renavamDB => `LOWER(${renavamDB}) ILIKE LOWER('${renavam}')`)
            : undefined,
        },
      ],
    });

    return veiculos;
  }

  public async checkIdentifcadorIsActive(
    identificador: string,
    data_identificador?: Date,
  ): Promise<VeiculoIdenficador | undefined> {
    const identificadorToFound = await this.identificadorRepository.findOne({
      where: {
        identificador: Raw(
          identificadorDB =>
            `UPPER(${identificadorDB}) LIKE UPPER('${identificador}')`,
        ),
      },
    });

    const where = data_identificador
      ? {
          id_identificador: identificadorToFound?.id_identificador,
          ativo: '1',
          data_identificador: LessThanOrEqual(data_identificador),
        }
      : {
          id_identificador: identificadorToFound?.id_identificador,
          ativo: '1',
        };

    return this.veiculosIdentificadoresRepository.findOne({
      where,
      order: {
        id_veiculo_idenficador: 'DESC',
      },
    });
  }
}

export default CheckRepository;
