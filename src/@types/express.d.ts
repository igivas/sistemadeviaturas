type Perfil = {
  id_perfil: number;
  descricao: string;
};
declare namespace Express {
  //  eslint-disable-next-line
  export interface Request {
    user: {
      id_usuario: string;
      perfis: Perfil[];
    };
  }
}
