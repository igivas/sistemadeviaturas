import { getRepository, Repository, Like, Not } from 'typeorm';
import IPessoasTelefonesRepository from './interfaces/IPessoasTelefonesRepository';
import PessoaTelefone from '../entities/PessoaTelefone';
import ICreateTelefone from '../dtos/ICreateTelefoneDTO';

class PessoasTelefonesRepository implements IPessoasTelefonesRepository {
  private pessoaTelefoneRepository: Repository<PessoaTelefone>;

  constructor() {
    this.pessoaTelefoneRepository = getRepository(PessoaTelefone);
  }

  public async update(
    telefone: PessoaTelefone,
    data: any,
    usuario_alteracao: string,
  ): Promise<PessoaTelefone> {
    const telefoneMerge = this.pessoaTelefoneRepository.merge(telefone, {
      ...data,
      usuario_alteracao,
      data_alteracao: new Date(),
    });

    const telefoneUpdated = await this.pessoaTelefoneRepository.save(
      telefoneMerge,
    );

    return telefoneUpdated;
  }

  public async delete(telefone: PessoaTelefone): Promise<void> {
    await this.pessoaTelefoneRepository.remove(telefone);
  }

  public async findTelefoneById(
    id: number,
  ): Promise<PessoaTelefone | undefined> {
    const telefone = await this.pessoaTelefoneRepository.findOne(id);
    return telefone;
  }

  public async findTelefoneByPf(
    fone: string,
    pes_codigo: string,
    pes_tipo_fone: string,
  ): Promise<PessoaTelefone | undefined> {
    const tailFone = fone.slice(-8);
    let telefone;
    if (pes_tipo_fone === '2') {
      telefone = await this.pessoaTelefoneRepository.findOne({
        where: {
          pes_codigo,
          pes_tipo_fone,
        },
      });
    } else {
      telefone = await this.pessoaTelefoneRepository.findOne({
        where: {
          pes_fone: Like(`%${tailFone}%`),
          pes_codigo,
          pes_tipo_fone: Not('2'),
        },
      });
    }

    return telefone;
  }

  public async findTelefoneByPfAndByTipo(
    pes_codigo: string,
    pes_tipo_fone: string,
  ): Promise<PessoaTelefone | undefined> {
    const telefone = await this.pessoaTelefoneRepository.findOne({
      where: {
        pes_codigo,
        pes_tipo_fone,
      },
    });

    return telefone;
  }

  public async create(data: ICreateTelefone): Promise<PessoaTelefone> {
    const { max } = await this.pessoaTelefoneRepository
      .createQueryBuilder('pessoa_fone')
      .select('max(pessoa_fone.pes_codigo_fone)', 'max')
      .getRawOne();
    const telefone = this.pessoaTelefoneRepository.create({
      ...data,
      pes_codigo_fone: max + 1,
      data_cadastro: new Date(),
    });

    const novoTelefone = await this.pessoaTelefoneRepository.save(telefone);

    return novoTelefone;
  }
}

export default PessoasTelefonesRepository;
