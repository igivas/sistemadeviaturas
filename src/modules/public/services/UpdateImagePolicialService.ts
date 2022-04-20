import { injectable, inject } from 'tsyringe';
import IPessoasFisicasPmsRepository from '@modules/public/repositories/interfaces/IPessoasFisicasPmsRepository';
import AppError from '../../../errors/AppError';

interface IRequest {
  file: Buffer;
  pm_codigo: string;
  id_usuario: string;
}

@injectable()
class UpdateImagePolicialService {
  constructor(
    @inject('PessoasFisicasPmsPublicRepository')
    private pessoasPmRepository: IPessoasFisicasPmsRepository,
  ) {}

  async execute({ pm_codigo, file, id_usuario }: IRequest): Promise<void> {
    try {
      await this.pessoasPmRepository.updateImage(pm_codigo, file, id_usuario);
    } catch (error) {
      throw new AppError('Ocorreu um erro ao salvar a imagem!');
    }
  }
}

export default UpdateImagePolicialService;
