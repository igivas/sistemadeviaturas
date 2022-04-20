import { IContextJWT } from '../../../interfaces/drivers/IContextJWT';

class JWTContext implements IContextJWT {
  private strategy: IContextJWT;

  public setStrategy(strategy: IContextJWT): void {
    this.strategy = strategy;
  }

  public getStrategy(): IContextJWT {
    return this.strategy;
  }

  validateToken(token: string): any {
    return this.strategy.validateToken(token);
  }

  createToken(secret: string, dadosUsuario?: object): string {
    return this.strategy.createToken(secret, dadosUsuario);
  }
}

export default JWTContext;
