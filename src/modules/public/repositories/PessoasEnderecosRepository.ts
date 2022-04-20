import { getRepository, Repository } from 'typeorm';
import IPessoasEnderecosRepository from './interfaces/IPessoasEnderecosRepository';
import PessoaEndereco from '../entities/PessoaEndereco';
import IUpdateEnderecoDTO from '../dtos/IUpdateEnderecoDTO';

class PessoasEnderecosRepository implements IPessoasEnderecosRepository {
  private pessoaEnderecoRepository: Repository<PessoaEndereco>;

  constructor() {
    this.pessoaEnderecoRepository = getRepository(PessoaEndereco);
  }

  public async update(
    endereco: PessoaEndereco,
    newData: IUpdateEnderecoDTO,
  ): Promise<PessoaEndereco> {
    const enderecoUpdated = this.pessoaEnderecoRepository.merge(endereco, {
      data_alteracao: new Date(),
      ...newData,
    });

    await this.pessoaEnderecoRepository.save(enderecoUpdated);

    return enderecoUpdated;
  }

  public async findById(id: number): Promise<PessoaEndereco | undefined> {
    const endereco = await this.pessoaEnderecoRepository.findOne(id);

    return endereco;
  }
}

export default PessoasEnderecosRepository;
