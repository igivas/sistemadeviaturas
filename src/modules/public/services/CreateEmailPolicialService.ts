import { injectable, inject } from 'tsyringe';
import AppError from '../../../errors/AppError';
import PessoaEmail from '../entities/PessoaEmail';

import IPessoasEmailsRepository from '../repositories/interfaces/IPessoasEmailsRepository';
import IPessoasFisicasPmsRepository from '../repositories/interfaces/IPessoasFisicasPmsRepository';

interface IRequest {
  pes_email: string;
  pes_codigo: string;
  id_usuario: string;
}

@injectable()
class CreateEmailPolicialService {
  constructor(
    @inject('PessoasEmailsRepository')
    private pessoaEmailRepository: IPessoasEmailsRepository,

    @inject('PessoasFisicasPmsPublicRepository')
    private pessoasFisicasPmRepository: IPessoasFisicasPmsRepository,
  ) {}

  public async execute(data: IRequest): Promise<PessoaEmail> {
    const emailExists = await this.pessoaEmailRepository.findEmail(
      data.pes_email,
    );

    if (emailExists) {
      throw new AppError('Este email já consta na base de dados!');
    }

    const pessoa = await this.pessoasFisicasPmRepository.findByMatricula(
      data.pes_codigo,
    );

    if (!pessoa) {
      throw new AppError(
        'Policial com esta matrícula não consta na base de dados!',
      );
    }

    const email = await this.pessoaEmailRepository.create(data);

    return email;
  }
}

export default CreateEmailPolicialService;
