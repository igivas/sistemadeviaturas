import ETipoMovimentacao from '@modules/veiculos/enums/ETipoMovimentacao';
import EFase from '@modules/veiculos/enums/EFase';
import ETipoAssinatura from '@modules/veiculos/enums/ETipoAssinatura';
import { IPostMovimentacaoManutencao } from './IPostMovimentacaoManutencao';
import { IPerfil } from '../../../../interfaces/middlewares/ITokenPayload';

export type IDefaultMovimentacao = {
  id_movimentacao?: number;
  id_opm_origem?: number;
  data_movimentacao?: Date;
  tipo_assinatura?: ETipoAssinatura;
  pin?: string;
  assinatura?: string;
  cpf?: string;
  criado_por: string;
  id_tipo_movimentacao_fase: EFase;
  movimentacao?: IPostMovimentacao | IPostMovimentacaoByFile;
  manutencao?: IPostMovimentacaoManutencao;
  id_tipo_movimentacao?: ETipoMovimentacao;
  opms: number[];
};

export type IPostMovimentacao = {
  id_opm_destino?: number;
  observacao?: string;
  data_retorno?: Date;
  perfis: IPerfil[];
};

export type IPostMovimentacaoByFile = {
  id_tipo_movimentacao: ETipoMovimentacao;
  id_opm_origem: number;
  id_opm_destino: number;
  observacao?: string;
  identificador?: string;
  criado_por: string;
  movimentacao_file: Express.Multer.File;
  perfis: IPerfil[];
};

export type IPostMovimentacaoTransferenciaByFile = IPostMovimentacaoByFile & {
  data_retorno: Date;
};
