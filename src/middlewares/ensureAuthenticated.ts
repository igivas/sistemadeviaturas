import { Request, Response, NextFunction } from 'express';
import AppError from '../errors/AppError';
import jwtContext from '../contexts/jwtContext';

export default function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('JWT token is missing', 401);
  }

  const [, token] = authHeader.split(' ');

  try {
    const userInfo = jwtContext.validateToken(token);

    request.user = {
      id_usuario: userInfo.id_usuario,
      perfis: userInfo.perfis,
    };

    return next();
  } catch (error) {
    throw new AppError('Invalid JWT token', 401);
  }
}
