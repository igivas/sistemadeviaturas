import { injectable, inject } from 'tsyringe';
import AppError from '../../../errors/AppError';
import PessoaEndereco from '../entities/PessoaEndereco';

import IPessoasEnderecosRepository from '../repositories/interfaces/IPessoasEnderecosRepository';

interface IRequest {
  id_usuario: string;
  pes_codigo: string;
  pes_tipo_endereco: string;
  pes_situacao_endereco: string;
  pes_cep: string;
  pes_endereco: string;
  pes_endereco_num: string;
  pes_endereco_complemento: string;
  pes_bairro: string;
  pes_cidade: string;
  pes_estado: string;
  pes_pais: string;
}

@injectable()
class CreateEnderecoPolicialService {
  constructor(
    @inject('PessoasEnderecosRepository')
    private pessoaEnderecosRepository: IPessoasEnderecosRepository,
  ) {}

  public async execute({
    id_usuario,
    ...rest
  }: IRequest): Promise<PessoaEndereco> {
    const enderecos = await this.pessoaEnderecosRepository.findByPesCodigo(
      rest.pes_codigo,
    );

    const tipos = enderecos
      ? enderecos.map(endereco => endereco.pes_tipo_endereco)
      : [];

    if (tipos.includes(rest.pes_tipo_endereco)) {
      throw new AppError('O Tipo de endereço já consta na base de dados!', 400);
    }

    const enderecoCreated = await this.pessoaEnderecosRepository.create({
      ...rest,
      usuario_cadastro: id_usuario,
    });

    return enderecoCreated;
  }
}

export default CreateEnderecoPolicialService;
