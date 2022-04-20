import ECombustivel from '@modules/veiculos/enums/ECombustivel';
import ETipoDocCarga from '@modules/veiculos/enums/ETipoDocCarga';
import { IPostAquisicao } from './IPostAquisicao';
import { IPostPrefixo } from './IPostPrefixo';
import { IPostIdentificador } from './IPostIdentificador';

export type IPostVeiculos = {
  aquisicao: IPostAquisicao;
  prefixo?: IPostPrefixo;
  identificador: IPostIdentificador;

  // Dados do veiculo
  chassi: string;
  placa?: string;
  renavam?: string;
  id_veiculo_especie: number;
  id_marca: number;
  id_modelo: number;
  id_cor: number;
  uf: string;
  ano_modelo: number;
  ano_fabricacao: number;
  combustivel: ECombustivel;
  numero_crv?: string;
  codigo_seguranca_crv?: string;
  numero_motor: string;
  referenciasPneus: { id_pneu: number }[];
  valor_fipe?: string;
  km?: number;
  is_reserva?: boolean;

  // Dados da Carga do veiculo
  numero_doc_carga?: string;
  data_doc_carga?: Date;
  tipo_doc_carga: ETipoDocCarga;
  orgao_tombo?: number;
  tombo?: string;

  // Dados adicionais de veiculo
  data_operacao?: Date;
  observacao?: string;
};
