import { getRepository, Repository } from 'typeorm';
import IPessoasEmailsRepository from './interfaces/IPessoasEmailsRepository';
import PessoaEmail from '../entities/PessoaEmail';
import ICreateEmail from '../dtos/ICreateEmailDTO';

class PessoasEmailsRepository implements IPessoasEmailsRepository {
  private pessoaEmailRepository: Repository<PessoaEmail>;

  constructor() {
    this.pessoaEmailRepository = getRepository(PessoaEmail);
  }

  public async create({
    pes_codigo,
    pes_email,
    id_usuario,
  }: ICreateEmail): Promise<PessoaEmail> {
    const { max } = await this.pessoaEmailRepository
      .createQueryBuilder('pessoa_email')
      .select('max(pessoa_email.pes_codigo_email)', 'max')
      .getRawOne();

    const email = this.pessoaEmailRepository.create({
      pes_codigo_email: max + 1,
      pes_codigo,
      pes_email,
      usuario_cadastro: id_usuario,
      data_cadastro: new Date(),
      pes_tipo_email: pes_email.split('@')[1] === 'pm.ce.gov.br' ? '2' : '3',
    });

    const novoEmail = this.pessoaEmailRepository.save(email);

    return novoEmail;
  }

  public async findEmail(pes_email: string): Promise<PessoaEmail | undefined> {
    const email = await this.pessoaEmailRepository.findOne({
      where: {
        pes_email,
      },
    });

    return email;
  }
}

export default PessoasEmailsRepository;
