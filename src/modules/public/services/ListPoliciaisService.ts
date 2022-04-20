import { injectable, inject } from 'tsyringe';
import IPessoasFisicasPmsRepository from '../repositories/interfaces/IPessoasFisicasPmsRepository';
import PessoaPm from '../entities/VListaPoliciais';

@injectable()
class ListOpmsService {
  constructor(
    @inject('PessoasFisicasPmsPublicRepository')
    private pessoaRepository: IPessoasFisicasPmsRepository,
  ) {}

  public async execute(
    query: string | undefined,
  ): Promise<PessoaPm[] | undefined> {
    const policiais = await this.pessoaRepository.findByQuery(query);

    return policiais;
  }
}

export default ListOpmsService;
