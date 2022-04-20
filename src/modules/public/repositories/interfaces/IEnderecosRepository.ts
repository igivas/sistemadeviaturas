import Endereco from '@modules/public/entities/Endereco';

export type IEnderecosRepository = {
  findByMunicipio(
    id_municipio: string,
    endereco?: string,
    cep?: string,
  ): Promise<Endereco[]>;
};
