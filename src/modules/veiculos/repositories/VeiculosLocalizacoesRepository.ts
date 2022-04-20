import { getRepository, QueryRunner, Repository, Brackets } from 'typeorm';
import VeiculoLocalizacao from '../entities/VeiculoLocalizacao';
import { IVeiculosLocalizacoesRepository } from './interfaces/IVeiculosLocalizacoesRepository';

type FindVeiculosLocalizacoes = {
  opms?: number[];
  fields?: string[];
  fieldSort?: string[];
  orderSort?: string[];
};

class VeiculosLocalizacoesRepository
  implements IVeiculosLocalizacoesRepository {
  private ormRepository: Repository<VeiculoLocalizacao>;

  constructor() {
    this.ormRepository = getRepository(VeiculoLocalizacao);
  }

  async findLocalizacoes(
    page: number,
    perPage: number,
    query: string,
    { opms, fields, fieldSort, orderSort }: FindVeiculosLocalizacoes,
  ): Promise<[VeiculoLocalizacao[], number]> {
    const querySearch = this.ormRepository
      .createQueryBuilder('veiculosLocalizacoes')
      .innerJoinAndSelect('veiculosLocalizacoes.veiculo', 'veiculo')
      .innerJoinAndSelect('veiculo.veiculoCarga', 'veiculoCarga')
      .where(
        'veiculosLocalizacoes.data_localizacao = (SELECT MAX(data_localizacao) from sav2.veiculos_localizacoes where id_veiculo = veiculosLocalizacoes.id_veiculo)',
      );
    if (!opms?.includes(-1))
      querySearch.andWhere('veiculoCarga.opm_carga IN(:...opms)', { opms });
    if (fields && fields?.length > 0 && query) {
      querySearch.andWhere(
        new Brackets(subQb => {
          fields.forEach(field => {
            subQb.orWhere(`LOWER(${field}) ILIKE LOWER('%${query}%')`);
          });
        }),
      );
    }

    if (
      orderSort &&
      fieldSort &&
      fieldSort.length > 0 &&
      fieldSort.length === orderSort.length
    ) {
      fieldSort.forEach((field, index) => {
        querySearch.addOrderBy(
          field,
          orderSort[index].toUpperCase() as 'ASC' | 'DESC',
        );
      });
    } else querySearch.orderBy('veiculosLocalizacoes.data_localizacao', 'DESC');

    if (page && perPage) {
      querySearch.skip(page * perPage - perPage).take(perPage);
    }

    return querySearch.getManyAndCount();
  }

  async create(
    data: VeiculoLocalizacao,
    queryRunner?: QueryRunner,
  ): Promise<VeiculoLocalizacao> {
    const movimentacaoManutencaoLocalizacao = queryRunner
      ? queryRunner.manager.create(VeiculoLocalizacao, data)
      : this.ormRepository.create(data);

    return queryRunner
      ? queryRunner.manager.save(movimentacaoManutencaoLocalizacao)
      : this.ormRepository.save(movimentacaoManutencaoLocalizacao);
  }

  update(
    oldValue: VeiculoLocalizacao,
    newData: Partial<VeiculoLocalizacao>,
    queryRunner?: QueryRunner,
  ): Promise<VeiculoLocalizacao | undefined> {
    throw new Error('Method not implemented.');
  }
}

export default VeiculosLocalizacoesRepository;
