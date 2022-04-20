import PessoaFisicaPm from '@modules/public/entities/PessoaFisicaPm';

export default class UsuarioDTOResponse {
  private _nome: string;

  private _cpf: string;

  private _matricula: string;

  private _id_post_grad: number;

  constructor({
    pessoa,
    pm_codigo,
    gra_codigo,
    pm_cpf,
  }: Pick<PessoaFisicaPm, 'pm_codigo' | 'gra_codigo' | 'pm_cpf' | 'pessoa'>) {
    this.nome = pessoa.pes_nome;
    this.id_post_grad = gra_codigo;
    this.matricula = pm_codigo;
    this.cpf = pm_cpf;
  }

  public get nome(): string {
    return this._nome;
  }

  public set nome(value: string) {
    this._nome = value;
  }

  public get cpf(): string {
    return this._cpf;
  }

  public set cpf(value: string) {
    this._cpf = value;
  }

  public get matricula(): string {
    return this._matricula;
  }

  public set matricula(value: string) {
    this._matricula = value;
  }

  public get id_post_grad(): number {
    return this._id_post_grad;
  }

  public set id_post_grad(value: number) {
    this._id_post_grad = value;
  }
}
