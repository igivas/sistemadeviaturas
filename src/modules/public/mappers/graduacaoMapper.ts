import EQuadroPolicial from '../enums/EQuadroPolicial';
import EGraduacao from '../enums/EGraduacao';

const graduacaoMapper = {
  [EQuadroPolicial.QOPM]: [
    EGraduacao['CEL CMTE-GERAL'],
    EGraduacao.CEL,
    EGraduacao['TEN-CEL'],
    EGraduacao.MAJ,
    EGraduacao.CAP,
    EGraduacao['1ºTEN'],
    EGraduacao['2ºTEN'],
  ],
  [EQuadroPolicial.QPPM]: [
    EGraduacao.SUBTEN,
    EGraduacao['1ºSGT'],
    EGraduacao['2ºSGT'],
    EGraduacao['3ºSGT'],
    EGraduacao.CB,
    EGraduacao.SD,
  ],
};

export default graduacaoMapper;
