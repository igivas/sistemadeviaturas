import { getRepository, Repository, Raw, Not, In } from 'typeorm';
import graduacaoMapper from '@modules/public/mappers/graduacaoMapper';
import IPessoasFisicasPmsRepository from './interfaces/IPessoasFisicasPmsRepository';
import PessoaFisicaPm from '../entities/PessoaFisicaPm';

import VListaPoliciais from '../entities/VListaPoliciais';
import PessoaEmail from '../entities/PessoaEmail';
import PessoaEndereco from '../entities/PessoaEndereco';
import PessoaTelefone from '../entities/PessoaTelefone';

interface IPessoaResponse extends PessoaFisicaPm {
  endereco: PessoaEndereco | undefined;
  emails: PessoaEmail[] | undefined;
  telefones: PessoaTelefone[] | undefined;
}

interface IResponseFindPoliciais {
  total: number;
  totalPage: number;
  items: PessoaFisicaPm[];
}

class PessoasFisicasPmsRepository implements IPessoasFisicasPmsRepository {
  private pessoaPmRepository: Repository<PessoaFisicaPm>;

  private vListaRepository: Repository<VListaPoliciais>;

  // private pessoaRepository: Repository<Pessoa>;
  private pessoaEmailRepository: Repository<PessoaEmail>;

  private pessoaTelefoneRepository: Repository<PessoaTelefone>;

  private pessoaEnderecoRepository: Repository<PessoaEndereco>;

  // private opmRepository: Repository<Opm>;

  constructor() {
    this.pessoaPmRepository = getRepository(PessoaFisicaPm);
    this.vListaRepository = getRepository(VListaPoliciais);
    this.pessoaEmailRepository = getRepository(PessoaEmail);
    this.pessoaTelefoneRepository = getRepository(PessoaTelefone);
    this.pessoaEnderecoRepository = getRepository(PessoaEndereco);
  }

  public async findByQuery(
    query: string,
  ): Promise<VListaPoliciais[] | undefined> {
    const policiais = await this.vListaRepository.find({
      select: ['pm_codigo', 'nome'],
      where: [
        {
          nome: Raw(nome => `LOWER(${nome}) ILIKE '%${query}%'`),
          tipo_situcao: 1,
        },
      ],
      take: 15,
      order: {
        pm_codigo: 'ASC',
      },
    });

    return policiais;
  }

  public async findCpfsByOpm(
    uni_codigo: number,
  ): Promise<string[] | undefined> {
    const pessoas = await this.pessoaPmRepository.find({
      select: ['uni_codigo', 'pm_cpf'],
      where: {
        uni_codigo,
      },
    });

    const cpfs = pessoas.map(pessoa => pessoa.pm_cpf);

    return cpfs;
  }

  public async findByMatricula(
    matricula: string,
  ): Promise<PessoaFisicaPm | undefined> {
    const pessoa = await this.pessoaPmRepository.findOne({
      select: [
        'pm_codigo',
        'pm_apelido',
        'pm_numero',
        'gra_codigo',
        'uni_codigo',
        'data_alteracao',
        'pm_cpf',
      ],
      relations: ['pessoa'],
      where: { pm_codigo: matricula },
    });

    return pessoa;
  }

  public async findByCpf(cpf: string): Promise<PessoaFisicaPm | undefined> {
    const pessoa = await this.pessoaPmRepository.findOne({
      select: [
        'pm_codigo',
        'pm_cpf',
        'pm_apelido',
        'pm_numero',
        'gra_codigo',
        'uni_codigo',
        'data_alteracao',
      ],
      where: { pm_cpf: cpf },
      relations: ['pessoa'],
    });

    return pessoa;
  }

  public async findByPesCodigo(
    pes_codigo: string,
  ): Promise<PessoaFisicaPm | undefined> {
    const pessoa = await this.pessoaPmRepository.findOne({
      select: [
        'pm_codigo',
        'pm_cpf',
        'pm_apelido',
        'pm_numero',
        'gra_codigo',
        'uni_codigo',
        'data_alteracao',
      ],
      where: { pm_codigo: pes_codigo },
      relations: ['pessoa'],
    });

    return pessoa;
  }

  public async findByOpm(
    opm: number,
    page: number,
    perPage: number,
    cpfsNaoBuscar: string[],
    sortfields?: string | undefined,
    sorts?: string | undefined,
  ): Promise<IResponseFindPoliciais | undefined> {
    const fieldsSortValid = ['pm_codigo', 'pm_apelido', 'gra_codigo'];
    let fields: string[];
    let sortsList: string[];
    const orders: { [key: string]: string } = {};
    if (sortfields && sorts) {
      fields = sortfields.split(',');
      sortsList = sorts.split(',');

      fields.forEach((field, index) => {
        if (fieldsSortValid.includes(field)) {
          orders[field] = sortsList[index];
        }
      });
    }
    const [policiais, total] = await this.pessoaPmRepository.findAndCount({
      select: [
        'pm_codigo',
        'pm_cpf',
        'pm_apelido',
        'pm_numero',
        'gra_codigo',
        'uni_codigo',
        'data_alteracao',
        'pm_atividade',
      ],
      where: {
        uni_codigo: opm,
        pm_cpf: Not(In(cpfsNaoBuscar)),
        pm_atividade: '01',
      },
      skip: page * perPage - perPage,
      take: perPage,
      order: { ...orders, gra_codigo: 'ASC' },
      relations: ['graduacao'],
    });

    return {
      total,
      totalPage: Math.ceil(total / Number(perPage)),
      items: policiais,
    };
  }

  public async findEmailByPesCodigoAndEmail(
    pes_codigo: string,
    email: string,
  ): Promise<PessoaEmail | undefined> {
    const pessoaEmail = await this.pessoaEmailRepository.findOne({
      select: ['pes_codigo', 'pes_email'],
      where: {
        pes_codigo,
        pes_email: Raw(pes_email => `LOWER(${pes_email}) ILIKE '%${email}%'`),
      },
    });

    return pessoaEmail;
  }

  public async updateImage(
    pm_codigo: string,
    file: Buffer,
    usuario_alteracao: string,
  ): Promise<void> {
    await this.pessoaPmRepository
      .createQueryBuilder('pessoa_pm')
      .update()
      .set({
        pm_foto: file,
        usuario_alteracao,
        data_alteracao: new Date(),
      })
      .where('pessoa_pm.pm_codigo = :id', { id: pm_codigo })
      .execute();
  }

  public async findFullByMatricula(matricula: string): Promise<any> {
    const pessoa = await this.pessoaPmRepository.findOne({
      select: [
        'pm_codigo',
        'pm_apelido',
        'pm_cpf',
        'pm_numero',
        'uni_codigo',
        'gra_codigo',
      ],
      where: { pm_codigo: matricula },
      relations: ['pessoa', 'graduacao', 'opm'],
    });

    const enderecos = await this.pessoaEnderecoRepository.find({
      select: [
        'pes_codigo_endereco',
        'pes_endereco',
        'pes_endereco_complemento',
        'pes_endereco_num',
        'pes_bairro',
        'pes_cidade',
        'pes_estado',
        'pes_cep',
        'pes_tipo_endereco',
        'pes_situacao_endereco',
      ],
      where: {
        pes_situacao_endereco: '01', // endereco atual
        pes_codigo: matricula,
      },
    });

    const emails = await this.pessoaEmailRepository.find({
      select: ['pes_codigo_email', 'pes_email'],
      where: {
        pes_codigo: matricula,
      },
    });

    const telefones = await this.pessoaTelefoneRepository.find({
      select: ['pes_codigo_fone', 'pes_fone', 'pes_tipo_fone'],
      where: {
        pes_codigo: matricula,
      },
    });

    return {
      ...pessoa,
      enderecos: enderecos || [],
      telefones: telefones || [],
      emails: emails || [],
      // opm: opm || {},
    };
  }

  public async findById(
    matricula: string,
  ): Promise<PessoaFisicaPm | undefined> {
    return this.pessoaPmRepository.findOne({
      where: {
        pm_codigo: matricula,
      },
      relations: ['pessoa'],
    });
  }

  async findOficiaisByIdsOpms(opms: number[]): Promise<PessoaFisicaPm[]> {
    return this.pessoaPmRepository.find({
      select: ['pm_codigo', 'pm_cpf'],
      where: {
        gra_codigo: In(graduacaoMapper[1]),
        uni_codigo: In(opms),
      },
    });
  }

  async findByIdOpmAndUsuCodigo(
    opms: number[],
    pm_codigo: string,
  ): Promise<PessoaFisicaPm | undefined> {
    return this.pessoaPmRepository.findOne({
      select: ['pm_codigo', 'pm_cpf'],
      where: {
        uni_codigo: In(opms),
        pm_codigo,
      },
    });
  }
}

export default PessoasFisicasPmsRepository;
