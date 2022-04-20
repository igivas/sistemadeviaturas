import { injectable, inject } from 'tsyringe';
import AppError from '../../../errors/AppError';

import IPessoasTelefonesRepository from '../repositories/interfaces/IPessoasTelefonesRepository';

@injectable()
class DeleteTelefonePolicialService {
  constructor(
    @inject('PessoasTelefonesRepository')
    private pessoaTelefoneRepository: IPessoasTelefonesRepository,
  ) {}

  public async execute(id: number): Promise<void> {
    const telefone = await this.pessoaTelefoneRepository.findTelefoneById(id);

    if (!telefone) {
      throw new AppError('Este telefone não existe!');
    }

    await this.pessoaTelefoneRepository.delete(telefone);
  }
}

export default DeleteTelefonePolicialService;
