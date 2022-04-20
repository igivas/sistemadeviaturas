import PessoaEmail from '../../entities/PessoaEmail';

import ICreateEmailDTO from '../../dtos/ICreateEmailDTO';

export default interface IPessoasEmailsRepository {
  create(data: ICreateEmailDTO): Promise<PessoaEmail>;
  findEmail(email: string): Promise<PessoaEmail | undefined>;
}
