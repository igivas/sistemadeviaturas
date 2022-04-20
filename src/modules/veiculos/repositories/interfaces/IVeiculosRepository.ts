import { IGetFrota } from '@modules/veiculos/interfaces/request/IGetFrota';
import Veiculo from '../../entities/Veiculo';
import { IDefaultRepository } from './IDefaultRepository';
// import SituacaoVeiculo from '../../entities/SituacaoVeiculo';

type FindVeiculos = {
  origem_aquisicao?: string;
  ids_situacoes_veiculos?: number[];
  ids_situacoes_veiculos_especificos?: number[];
  id_modelo?: string;
  ano_fabricacao?: string;
  is_reserva?: '0' | '1';
  opms?: number[];
};

export default interface IVeiculosRepository
  extends IDefaultRepository<Veiculo> {
  findById(id: string): Promise<Veiculo | undefined>;
  findByRenavam(renavam: string): Promise<[Veiculo[], number]>;
  findByPlaca(placa: string): Promise<[Veiculo[], number]>;
  findByChassi(chassi: string): Promise<[Veiculo[], number]>;
  // findLastSituacao(id_veiculo: string): Promise<SituacaoVeiculo>;
  findVeiculos(
    page: number,
    perPage: number,
    query: string,
    options: FindVeiculos,
    fields?: string[],
    fieldSort?: string[],
    orderSort?: string[],
  ): Promise<[Veiculo[], number]>;
  findAllVeiculos(): Promise<Veiculo[]>;

  countVeiculos(
    frota: Omit<IGetFrota, 'situacao' | 'opms'> & {
      situacao: number;
      opms: number[];
    },
  ): Promise<number>;

  delete(veiculo: Veiculo): Promise<Veiculo>;

  findALlVeiculosMovimentacoesByIdOpm(
    id_opm: number,
    page: number,
    perPage: number,
  ): Promise<{ items: Veiculo[]; total: number; totalPage: number }>;

  findAllAnoFabricacao(opms: number[]): Promise<Veiculo[]>;

  findAllModelosByOpms(
    opms: number[],
    page?: number,
    perPage?: number,
  ): Promise<[Pick<Veiculo, 'id_modelo' | 'veiculoModelo'>[], number]>;
}
