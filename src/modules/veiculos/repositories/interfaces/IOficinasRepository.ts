import Oficina from '@modules/veiculos/entities/Oficina';
import { QueryRunner } from 'typeorm';

export default interface IOficinasRepository {
  findOficinas(
    fields: string[],
    orderSort: string[],
    fieldsSort: string[],
    page?: number,
    perPage?: number,
    query?: string,
  ): Promise<[Oficina[], number]>;
  findById(id_oficina: string): Promise<Oficina | undefined>;
  create(oficinas: Oficina[], queryRunner?: QueryRunner): Promise<Oficina[]>;
  findByName(nome: string): Promise<Oficina | undefined>;
  listMatrizes(): Promise<Oficina[]>;
}
