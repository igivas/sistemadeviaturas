import { sign } from 'jsonwebtoken';
import authConfig from '@config/auth';
import { injectable, inject } from 'tsyringe';
import AppError from '../../../errors/AppError';

import IUsuariosRepository from '../repositories/interfaces/IUsuariosRepository';
import IHashProvider from '../providers/HashProvider/IHashProvider';

interface IRequest {
  matricula: string;
  password: string;
  payload: any;
  expires_in: string;
}

interface IResponse {
  token: string;
}

@injectable()
class TokenAccessService {
  constructor(
    @inject('UsuariosRepository')
    private usuariosRepository: IUsuariosRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    matricula,
    password,
    payload,
    expires_in,
  }: IRequest): Promise<IResponse> {
    const matriculaSanatized = matricula.replace(/[.-]/g, '').trim();
    const passwordSanatized = password.trim();

    if (!(matriculaSanatized === '13444013')) {
      throw new AppError('O usuário não tem permissão para este recurso', 401);
    }

    const usuario = await this.usuariosRepository.findByMatricula(
      matriculaSanatized,
    );

    if (!usuario) {
      throw new AppError('Ocorreu um erro, verifique o usuário e senha!', 401);
    }

    const hashMatched = await this.hashProvider.compareHash(
      passwordSanatized,
      usuario.usu_senha,
    );

    if (!hashMatched) {
      throw new AppError('Ocorreu um erro, verifique o usuário e senha!', 401);
    }

    const { secret } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: JSON.stringify(payload),
      expiresIn: expires_in,
    });

    return { token };
  }
}

export default TokenAccessService;
