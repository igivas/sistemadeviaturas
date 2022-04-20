import { injectable } from 'tsyringe';
import authConfig from '@config/auth';
import { verify, sign } from 'jsonwebtoken';
import { IContextJWT } from '../../../interfaces/drivers/IContextJWT';
import { ITokenPayload } from '../../../interfaces/middlewares/ITokenPayload';

@injectable()
class JsonWebTokenJWTStrategy implements IContextJWT {
  createToken(secret: string, dadosUsuario?: object): string {
    return sign({}, secret, {
      subject: JSON.stringify(dadosUsuario),
      expiresIn: authConfig.jwt.expiresIn,
    });
  }

  validateToken(token: string): any {
    const tokenDecoded = verify(token, authConfig.jwt.secret);
    const { sub } = tokenDecoded as ITokenPayload;

    return JSON.parse(sub);
  }
}

export default JsonWebTokenJWTStrategy;
