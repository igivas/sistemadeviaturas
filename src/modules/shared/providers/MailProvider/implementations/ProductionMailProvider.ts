import nodemailer, { Transporter } from 'nodemailer';
import { injectable, inject } from 'tsyringe';

import ISendMailDto from '../dtos/ISendMailDTO';
import IMailProvider from '../models/IMailProvider';

import IMailTemplateProvider from '../../MailTemplateProvider/models/IMailTemplateProvider';

@injectable()
export default class ProductionMailProvider implements IMailProvider {
  private client: Transporter;

  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProvider: IMailTemplateProvider,
  ) {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    this.client = transporter;
  }

  public async sendMail({
    to,
    from,
    subject,
    templateData,
  }: ISendMailDto): Promise<void> {
    const message = await this.client.sendMail({
      from: {
        name: from?.name || 'CETIC PMCE',
        address: from?.email || 'sistemaspm@sspds.ce.gov.br',
      },
      to: {
        name: to.name,
        address: to.email,
      },
      subject,
      html: await this.mailTemplateProvider.parse(templateData),
    });

    /* eslint-disable no-console */
    console.log(`Message sent: ${message.messageId}`);
  }
}
