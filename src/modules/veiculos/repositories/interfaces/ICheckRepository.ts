import Prefixo from '@modules/veiculos/entities/Prefixo';
import Veiculo from '@modules/veiculos/entities/Veiculo';
import VeiculoIdenficador from '@modules/veiculos/entities/VeiculoIdentificador';

export type PickUndefined<T, K extends keyof T> = {
  [P in K]?: T[P] | null;
};

type CheckPrefixo = {
  prefixo_tipo?: string;
  prefixo_sequencia: string;
};

export default interface ICheckRepository {
  checkPrefixo({
    prefixo_sequencia,
    prefixo_tipo,
  }: CheckPrefixo): Promise<Prefixo | undefined>;

  checkVeiculo({
    chassi,
    placa,
  }: PickUndefined<
    Veiculo,
    'chassi' | 'placa' | 'numero_crv' | 'renavam' | 'codigo_seguranca_crv'
  >): Promise<Veiculo | undefined>;

  checkIdentifcadorIsActive(
    identificador: string,
    data_identificador?: Date,
  ): Promise<VeiculoIdenficador | undefined>;
}
