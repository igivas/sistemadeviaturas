import Unidade from '@modules/public/entities/Unidade';

class UnidadeDTOResponse {
  private id_opm: number;

  private nome: string;

  private comandante: string;

  private sigla: string;

  private lob: number;

  constructor({
    uni_codigo,
    uni_nome,
    uni_sigla,
    uni_lob,
    pes_comandante,
  }: Pick<
    Unidade,
    'pes_comandante' | 'uni_codigo' | 'uni_nome' | 'uni_sigla' | 'uni_lob'
  >) {
    this.id_opm = uni_codigo;

    this.nome = uni_nome;

    this.comandante = pes_comandante;

    this.sigla = uni_sigla;

    this.lob = uni_lob;
  }

  public get getComandante(): string {
    return this.comandante;
  }
}

export default UnidadeDTOResponse;
