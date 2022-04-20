import { getRepository, Repository, In, QueryRunner } from 'typeorm';
import IPneusRepository from '@modules/veiculos/repositories/interfaces/IPneusRepository';
import Pneu from '../entities/Pneu';

// const optionsOrigemAquisicao = {
//   0: 'Orgânico',
//   1: 'Locado',
//   2: 'Cessão',
// };

// const formatResponseVeiculos = (veiculos: ReferenciaPneus[]): object[] => {
//   const resposta = veiculos?.map((veiculo: Veiculo): object => {
//     return {
//       ...veiculo,
//       origem_aquisicao: {
//         value: veiculo.origem_aquisicao,
//         text: optionsOrigemAquisicao[veiculo.origem_aquisicao],
//       },
//     };
//   });
//   return resposta;
// };

class ReferenciaPneusRepository implements IPneusRepository {
  private ormRepository: Repository<Pneu>;

  constructor() {
    this.ormRepository = getRepository(Pneu);
  }

  public async findReferencias(id_veiculo_especie?: number): Promise<Pneu[]> {
    let referenciasPneus;
    if (id_veiculo_especie) {
      referenciasPneus = this.ormRepository.find({
        where: { id_veiculo_especie },
      });
    } else {
      referenciasPneus = this.ormRepository.find();
    }

    return referenciasPneus;
  }

  public async create(
    referenciaPneuData: Pneu,
    queryRunner?: QueryRunner,
  ): Promise<Pneu> {
    const referenciaPneu = queryRunner
      ? queryRunner.manager.create(Pneu, referenciaPneuData)
      : this.ormRepository.create(referenciaPneuData);

    return queryRunner
      ? queryRunner.manager.save(referenciaPneu)
      : this.ormRepository.save(referenciaPneu);
  }

  update(
    oldValue: Pneu,
    newData: object,
    queryRunner?: QueryRunner,
  ): Promise<Pneu | undefined> {
    throw new Error('Method not implemented.');
  }

  public async findReferenciasByIds(idsReferencias: number[]): Promise<Pneu[]> {
    const referencias = await this.ormRepository.find({
      where: {
        id_referencia_pneu: In(idsReferencias),
      },
    });

    return referencias;
  }

  public async findReferenciasByDesc(
    referencia: string,
  ): Promise<Pneu | undefined> {
    const referencias = await this.ormRepository.findOne({
      where: {
        referencia,
      },
    });

    return referencias;
  }

  // public async findReferencias(): Promise<ReferenciaPneus[]> {

  //   const [veiculos, total] = await this.ormRepository.findAndCount({
  //     skip: page * perPage - perPage,
  //     take: perPage,
  //     where: whereCustom,
  //   });

  //   const items = formatResponseVeiculos(veiculos);

  //   return {
  //     total,
  //     totalPage: Math.ceil(total / Number(perPage)),
  //     items,
  //   };
  // }

  public async findById(id: string): Promise<Pneu | undefined> {
    const veiculo = await this.ormRepository.findOne({
      where: {
        id_veiculo: id,
      },
      relations: [
        'identificadores',
        'kms',
        'prefixos',
        'veiculosReferenciasPneus',
        'veiculosReferenciasPneus.id_referencia_pneu',
        'id_orgao_aquisicao',
      ],
    });

    return veiculo;
  }
}

export default ReferenciaPneusRepository;
