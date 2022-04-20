import GrupoEmail from '@modules/veiculos/entities/GrupoEmail';
import { QueryRunner } from 'typeorm';

export type IGruposEmailsRepository = {
  create(data: GrupoEmail[], queryRunner?: QueryRunner): Promise<GrupoEmail[]>;

  findAllByIdGrupo(
    id_grupo: number,
    page?: number,
    perPage?: number,
  ): Promise<[GrupoEmail[], number]>;

  update(
    oldValue: GrupoEmail,
    newData: Partial<GrupoEmail>,
    queryRunner?: QueryRunner,
  ): Promise<GrupoEmail>;
};
