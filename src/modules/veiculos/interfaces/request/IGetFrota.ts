import { EOrigemDeAquisicao } from '@modules/veiculos/enums/EAquisicao';
import EEspecieVeiculo from '@modules/veiculos/enums/EEspecieVeiculo';
import { EEmprego, EPrefixoTipo } from '@modules/veiculos/enums/EPrefixo';

export type IGetFrota = {
  especies: EEspecieVeiculo[];
  aquisicao: EOrigemDeAquisicao;
  empregos: EEmprego[];
  situacao: string;
  opms: string[];
};
