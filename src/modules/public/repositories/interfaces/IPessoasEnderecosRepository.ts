import ICreateEnderecoDTO from '@modules/public/dtos/ICreateEnderecoDTO';
import PessoaEndereco from '@modules/public/entities/PessoaEndereco';
import IUpdateEnderecoDTO from '../../dtos/IUpdateEnderecoDTO';

export default interface IPessoasEmailsRepository {
  findById(id: number): Promise<PessoaEndereco | undefined>;
  findByPesCodigo(pes_codigo: string): Promise<PessoaEndereco[]>;
  update(
    endereco: PessoaEndereco,
    newData: IUpdateEnderecoDTO,
  ): Promise<PessoaEndereco>;
  create(endereco: ICreateEnderecoDTO): Promise<PessoaEndereco>;
}
