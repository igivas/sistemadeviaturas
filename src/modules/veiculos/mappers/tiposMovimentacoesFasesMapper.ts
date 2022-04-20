import ETipoMovimentacao from '../enums/ETipoMovimentacao';
import EFase from '../enums/EFase';

// eslint-disable-next-line import/prefer-default-export
export const movimentacoesFasesMapper = {
  [ETipoMovimentacao.TRANSFERENCIA]: [
    EFase.Oferta,
    EFase.Recusado,
    EFase.Recebimento,
  ],
  [ETipoMovimentacao.EMPRESTIMO]: [
    EFase.Oferta,
    EFase.Recusado,
    EFase.Recebimento,
    EFase.Devolução,
  ],
  [ETipoMovimentacao.MANUTENCAO]: [
    EFase.Entrega,
    EFase.Vistoria,
    EFase['Pendente Assinatura'],
  ],
};
