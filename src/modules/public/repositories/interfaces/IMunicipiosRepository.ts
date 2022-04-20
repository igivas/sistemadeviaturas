import Municipio from '@modules/public/entities/Municipio';

export type IMunicipiosRepository = {
  findByUf(uf: string): Promise<Municipio[]>;
};
