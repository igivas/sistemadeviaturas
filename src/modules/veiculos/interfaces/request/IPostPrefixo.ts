import { EPrefixoTipo, EEmprego } from '@modules/veiculos/enums/EPrefixo';

export type IPostPrefixo = {
  prefixo_tipo: EPrefixoTipo;
  prefixo_sequencia: string;
  emprego: EEmprego;
};
