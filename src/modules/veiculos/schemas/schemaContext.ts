import validationContext from '../../../contexts/validationContext';
import { createAquisicaoRules } from './rules/aquisicaoRules';
import { createPrefixoRules } from './rules/prefixoRules';
import { createIdentificadorRules } from './rules/identificadorRules';
import { createVeiculoRules } from './rules/veiculoRules';
import { createSituacaoRules } from './rules/situacaoRules';
import { createDocumentoMovimentacaoRules } from './rules/documentoMovimentacaoRules';
import {
  createMovimentacaoRules,
  createMovimentacaoManutencaoRules,
  createMovimentacaoEmprestimoRules,
} from './rules/movimentacaoRules';
import { createKmRules } from './rules/kmRules';
import { createEmailRules } from './rules/emailRules';
import { createReferenciasPneusRules } from './rules/referenciaPneuRules';
import { createOficinaRules } from './rules/oficinaRules';
import { createVeiculoModeloRules } from './rules/veiculoModeloRules';

export const aquisicaoSchema = validationContext.createSchema(
  createAquisicaoRules,
);
export const prefixoSchema = validationContext.createSchema(createPrefixoRules);

export const identificadorSchema = validationContext.createSchema(
  createIdentificadorRules,
);

export const veiculoSchema = validationContext.createSchema(createVeiculoRules);

export const putVeiculoSchema = validationContext.createSchema(
  createVeiculoRules.filter(
    rule => rule.chave !== 'prefixo' && rule.chave !== 'km',
  ),
);

export const situacaoSchema = validationContext.createSchema(
  createSituacaoRules,
);

export const documentoMovimentacaoSchema = validationContext.createSchema(
  createDocumentoMovimentacaoRules,
);

export const movimentacaoSchema = validationContext.createSchema(
  createMovimentacaoRules,
);

export const movimentacaoEmprestimoSchema = validationContext.createSchema(
  createMovimentacaoEmprestimoRules,
);

export const movimentacaoManutencaoSchema = validationContext.createSchema(
  createMovimentacaoManutencaoRules,
);

export const kmSchema = validationContext.createSchema(createKmRules);

export const emailSchema = validationContext.createSchema(createEmailRules);

export const pneusSchema = validationContext.createSchema(
  createReferenciasPneusRules,
);

export const oficinaSchema = validationContext.createSchema(createOficinaRules);

export const veiculoModeloSchema = validationContext.createSchema(
  createVeiculoModeloRules,
);
