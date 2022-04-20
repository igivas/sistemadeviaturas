export type IContextJWT = {
  validateToken(token: string): any;
  createToken(secret: string, dadosUsuario?: object): string;
};
