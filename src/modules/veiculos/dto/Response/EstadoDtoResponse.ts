import Uf from '@modules/public/entities/Uf';

class EstadoDtoResponse {
  private id_estado: string;

  private sigla: string;

  private nome: string;

  constructor({ id_uf, nome, sigla }: Uf) {
    this.id_estado = id_uf;
    this.sigla = sigla;
    this.nome = nome;
  }
}

export default EstadoDtoResponse;
