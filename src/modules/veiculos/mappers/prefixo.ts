import { EPrefixoTipo, EEmprego } from '../enums/EPrefixo';

const prefixoMapper = {
  [EPrefixoTipo['21 - ADM']]: [EEmprego['Não Consta']],
  [EPrefixoTipo['23 - Operacional']]: [
    EEmprego['Operacional - Caracterizada'],
    EEmprego['Operacional - Inteligência'],
  ],
  [EPrefixoTipo['MP - POG']]: [
    EEmprego['Operacional - Caracterizada'],
    EEmprego['Operacional - Inteligência'],
    EEmprego['Não Consta'],
  ],
  [EPrefixoTipo['MR - RAIO']]: [
    EEmprego['Operacional - Caracterizada'],
    EEmprego['Operacional - Inteligência'],
    EEmprego['Não Consta'],
  ],
  [EPrefixoTipo['22 - Apoio']]: [
    EEmprego.Ambulância,
    EEmprego['Base Móvel'],
    EEmprego['Não Consta'],
    EEmprego['Transporte Especializado'],
    EEmprego['Transporte de Animais'],
    EEmprego['Transporte de Pessoas'],
  ],
};

export default prefixoMapper;
