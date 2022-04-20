import Email from '@modules/veiculos/entities/Email';
import { QueryRunner } from 'typeorm';

export type IEmailsSearch = {
  ativo?: '0' | '1';
  email?: string;
};

export type IEmailsRepository = {
  create(data: Email[], queryRunner?: QueryRunner): Promise<Email[]>;

  findByEmail(email: string): Promise<Email | undefined>;

  findById(id_email: string): Promise<Email | undefined>;

  find(
    page: number,
    perPage: number,
    emails: IEmailsSearch,
  ): Promise<[Email[], number]>;

  update(
    oldValue: Email,
    newData: Partial<Email>,
    queryRunner?: QueryRunner,
  ): Promise<Email>;
};
