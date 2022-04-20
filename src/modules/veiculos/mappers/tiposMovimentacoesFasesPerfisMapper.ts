import EPerfisUsuarios from '@modules/seg/enums/EPerfisUsuarios';
import ETipoMovimentacao from '../enums/ETipoMovimentacao';
import EFase from '../enums/EFase';

type ITiposMovimentacoesFasesPerfisMapper = {
  [x: number]: {
    [y: number]: number[];
  };
};

// eslint-disable-next-line import/prefer-default-export
export const tiposMovimentacoesFasesPerfisMapper: ITiposMovimentacoesFasesPerfisMapper = {
  [ETipoMovimentacao.TRANSFERENCIA]: {
    [EFase.Oferta]: [EPerfisUsuarios['SAV - COLOG (ADM)']],
    [EFase.Recebimento]: [EPerfisUsuarios['SAV - COAFI']],
  },
};
