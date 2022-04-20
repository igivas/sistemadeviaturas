import { injectable, inject } from 'tsyringe';
import IPessoasEnderecosRepository from '../repositories/interfaces/IPessoasEnderecosRepository';

import AppError from '../../../errors/AppError';
import PessoaEndereco from '../entities/PessoaEndereco';

@injectable()
class ShowPolicialEnderecoService {
  constructor(
    @inject('PessoasEnderecosRepository')
    private pessoaEnderecosRepository: IPessoasEnderecosRepository,
  ) {}

  public async execute(id: number): Promise<PessoaEndereco> {
    const endereco = await this.pessoaEnderecosRepository.findById(id);

    if (!endereco) {
      throw new AppError('O endereço não existe', 404);
    }

    return endereco;
  }
}

export default ShowPolicialEnderecoService;
