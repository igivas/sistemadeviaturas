import { inject, injectable } from 'tsyringe';
import { getConnection } from 'typeorm';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import AppError from '../../../errors/AppError';
import Email from '../entities/Email';
import { IGetEmails } from '../interfaces/request/IGetEmails';
import { IPostEmail } from '../interfaces/request/IPostEmail';
import { IPutEmail } from '../interfaces/request/IPutEmail';
import { IEmailsRepository } from '../repositories/interfaces/IEmailsRepository';
import { IResponseEmails } from '../interfaces/response/IResponseEmails';
import { IGruposEmailsRepository } from '../repositories/interfaces/IGruposEmailsRepository';
import GrupoEmail from '../entities/GrupoEmail';

@injectable()
class CoreEmail {
  constructor(
    @inject('EmailsRepository')
    private emailsRepository: IEmailsRepository,

    @inject('GruposEmailsRepository')
    private gruposEmailsRepository: IGruposEmailsRepository,
  ) {}

  async list({
    page,
    perPage,
    email,
    active,
  }: IGetEmails): Promise<IResponseEmails> {
    const formatedPage = Number.parseInt(page, 10);
    const formatedPerPage = Number.parseInt(perPage, 10);

    if (Number.isNaN(formatedPage) && !!page.length)
      throw new AppError('Formato de Paginação invalido');

    if (Number.isNaN(formatedPerPage) && !!perPage.length)
      throw new AppError('Formato de Paginação invalido');

    if (
      (!formatedPage && formatedPerPage) ||
      (formatedPage && !formatedPerPage)
    )
      throw new AppError('Formato de Paginação invalido');

    const [emails, total] = await this.emailsRepository.find(
      formatedPage,
      formatedPerPage,
      {
        ativo: active,
        email,
      },
    );

    return {
      total: total as number,
      totalPage: Math.ceil((total as number) / Number(perPage)),
      items: emails,
    };
  }

  async create({ emails }: IPostEmail, criado_por: string): Promise<Email[]> {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    const existentEmails = await Promise.all(
      emails.map(async email => this.emailsRepository.findByEmail(email)),
    );

    const filteredExistentEmails = existentEmails.filter(email => !!email);

    if (filteredExistentEmails.length > 0)
      throw new AppError(
        `O(s) email(s) ${
          existentEmails.length > 1
            ? existentEmails
                .map(email => email?.email)
                .join(',')
                .replace(/,,/, '')
            : existentEmails
                .map(email => email?.email)
                .join(',')
                .replace(/,,/, '')
                .replace(/,,/, ',')
        } ja existem neste banco`,
      );

    const createdEmails = await this.emailsRepository.create(
      emails.map(
        email =>
          ({
            ativo: '1',
            email,
            id_email: uuidv4(),
            criado_por,
          } as Email),
      ),
    );

    await this.gruposEmailsRepository.create(
      createdEmails.map(
        createdEmail =>
          ({
            id_grupo_email: uuidv4(),
            id_email: createdEmail.id,
            id_grupo: 1,
            criado_por,
          } as GrupoEmail),
      ),
    );

    return createdEmails;
  }

  async update(
    id: string,
    { ativo, email, atualizado_por }: IPutEmail,
  ): Promise<Email> {
    const emailToUpdate = await this.emailsRepository.findById(id);

    if (!emailToUpdate) throw new AppError('O email não existe');

    const response = await this.emailsRepository.update(emailToUpdate, {
      ativo,
      email,
      atualizado_em: new Date(),
      atualizado_por,
    });

    return response;
  }

  async enviarEmail(
    assunto: string,
    message: string,
    id_grupo: number,
  ): Promise<void> {
    const [emailsGrupo] = await this.gruposEmailsRepository.findAllByIdGrupo(
      id_grupo,
    );

    await Promise.all(
      emailsGrupo.map(async emailGrupo => {
        await axios.post(
          'https://api-mail-dev.pm.ce.gov.br/send',
          {
            email: emailGrupo.email.email,
            assunto,
            html: message,
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.API_EMAIL}`,
            },
          },
        );
      }),
    );
  }
}

export default CoreEmail;
