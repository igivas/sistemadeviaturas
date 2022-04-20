import { IPostSituacao } from '../request/IPostSituacao';

export type ICreateSituacaoVeiculo = {
  situacao: IPostSituacao;
  idVeiculo: string;
  id_usuario: string;
};
