import {
  EOrigemDeAquisicao,
  EFormaDeAquisicao,
} from '@modules/veiculos/enums/EAquisicao';

export type IPostAquisicao = {
  origem_aquisicao: EOrigemDeAquisicao;
  data_aquisicao: Date;
  doc_aquisicao?: string;
  forma_aquisicao?: EFormaDeAquisicao;
  id_orgao_aquisicao?: number;
  valor_aquisicao?: number;
};
