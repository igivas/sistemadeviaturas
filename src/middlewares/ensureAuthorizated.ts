import EPerfil from '@modules/veiculos/enums/EPerfil';
import { Request, Response, NextFunction } from 'express';
import { decode } from 'jsonwebtoken';
import AppError from '../errors/AppError';

interface ITokenPayload {
  iad: number;
  exp: number;
  sub: string;
}

type IResponseEnsureAuthorization = (
  request: Request,
  response: Response,
  next: NextFunction,
) => void;

export default function ensureAuthorization(
  roles: EPerfil[],
): IResponseEnsureAuthorization {
  // eslint-disable-next-line func-names
  return function (
    request: Request,
    response: Response,
    next: NextFunction,
  ): void {
    const authHeader = request.headers.authorization;

    let perfis;

    if (!request.user) {
      if (!authHeader) {
        throw new AppError('JWT token is missing', 401);
      }

      const [, token] = authHeader.split(' ');

      const decoded = decode(token);

      const { sub } = decoded as ITokenPayload;
      const userInfo = JSON.parse(sub);
      perfis = userInfo.perfis;
    } else perfis = request.user.perfis;

    const perfilAdmOrSuperAdm = perfis.find(
      (perfil: any) =>
        perfil.id_perfil === EPerfil.Administrador ||
        perfil.id_perfil === EPerfil['Super Administrador'],
    );

    if (!perfis.includes(...roles) && !perfilAdmOrSuperAdm) {
      throw new AppError(
        'Usuário não possui autorização para esta requisição!',
        401,
      );
    }

    return next();
  };
}
