import { injectable, inject } from 'tsyringe';
import AppError from '../../../errors/AppError';
import ICreateTelefoneDTO from '../dtos/ICreateTelefoneDTO';
import PessoaTelefone from '../entities/PessoaTelefone';

import IPessoasTelefonesRepository from '../repositories/interfaces/IPessoasTelefonesRepository';

@injectable()
class CreateTelefonePolicialService {
  constructor(
    @inject('PessoasTelefonesRepository')
    private pessoaTelefoneRepository: IPessoasTelefonesRepository,
  ) {}

  public async execute(data: ICreateTelefoneDTO): Promise<PessoaTelefone> {
    const telefoneExists = await this.pessoaTelefoneRepository.findTelefoneByPf(
      data.pes_fone,
      data.pes_codigo,
      data.pes_tipo_fone,
    );

    if (telefoneExists) {
      throw new AppError('Este telefone já está cadastrado!');
    }

    // const telefoneByTipoExists = await this.pessoaTelefoneRepository.findTelefoneByPfAndByTipo(
    //   data.pes_codigo,
    //   data.pes_tipo_fone,
    // );

    // if (telefoneByTipoExists) {
    //   throw new AppError('Este tipo de telefone já está cadastrado!');
    // }

    const telefone = await this.pessoaTelefoneRepository.create(data);

    return telefone;
  }
}

export default CreateTelefonePolicialService;
