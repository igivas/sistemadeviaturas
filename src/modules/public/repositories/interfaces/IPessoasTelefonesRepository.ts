import PessoaTelefone from '../../entities/PessoaTelefone';

import ICreateTelefoneDTO from '../../dtos/ICreateTelefoneDTO';

export default interface IPessoasTelefonesRepository {
  create(data: ICreateTelefoneDTO): Promise<PessoaTelefone>;
  update(
    telefone: PessoaTelefone,
    data: { [key: string]: string },
    id_user: string,
  ): Promise<PessoaTelefone>;
  delete(telefone: PessoaTelefone): Promise<void>;
  findTelefoneById(id: number): Promise<PessoaTelefone | undefined>;
  findTelefoneByPf(
    telefone: string,
    pes_codigo: string,
    pes_tipo_fone: string,
  ): Promise<PessoaTelefone | undefined>;
  findTelefoneByPfAndByTipo(
    pes_codigo: string,
    pes_tipo_fone: string,
  ): Promise<PessoaTelefone | undefined>;
}
