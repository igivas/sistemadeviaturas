import IUsuariosRepository from '@modules/seg/repositories/interfaces/IUsuariosRepository';
import { injectable, inject } from 'tsyringe';
import AppError from '../../../errors/AppError';
import PessoaTelefone from '../entities/PessoaTelefone';

import IPessoasTelefonesRepository from '../repositories/interfaces/IPessoasTelefonesRepository';

interface IRequest {
  [key: string]: string;
}

@injectable()
class UpdateTelefonePolicialService {
  constructor(
    @inject('UsuariosRepository')
    private usuariosRepository: IUsuariosRepository,

    @inject('PessoasTelefonesRepository')
    private pessoaTelefoneRepository: IPessoasTelefonesRepository,
  ) {}

  public async execute(
    id: number,
    data: IRequest,
    id_usuario: string,
  ): Promise<PessoaTelefone> {
    const telefone = await this.pessoaTelefoneRepository.findTelefoneById(id);

    if (!telefone) {
      throw new AppError('Este telefone não existe!');
    }

    if (data.pes_tipo_fone) {
      if (data.pes_tipo_fone !== telefone.pes_tipo_fone) {
        const telefoneExists = await this.pessoaTelefoneRepository.findTelefoneByPfAndByTipo(
          telefone.pes_codigo,
          data.pes_tipo_fone,
        );

        if (telefoneExists) {
          throw new AppError('Este tipo de telefone já está cadastrado!');
        }
      }
    }

    const telefoneUpdated = await this.pessoaTelefoneRepository.update(
      telefone,
      data,
      id_usuario,
    );

    return telefoneUpdated;
  }
}

export default UpdateTelefonePolicialService;
