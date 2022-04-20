import nodemailer, { Transporter } from 'nodemailer';
import { injectable, inject } from 'tsyringe';

import ISendMailDto from '../dtos/ISendMailDTO';
import IMailProvider from '../models/IMailProvider';

import IMailTemplateProvider from '../../MailTemplateProvider/models/IMailTemplateProvider';

@injectable()
export default class EtherealMailProvider implements IMailProvider {
  private client: Transporter;

  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProvider: IMailTemplateProvider,
  ) {
    nodemailer.createTestAccount().then(account => {
      const transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass,
        },
      });

      this.client = transporter;
    });
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
        address: from?.email || 'fireberg2500@gmail.com',
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
    console.log(`Preview URL: ${nodemailer.getTestMessageUrl(message)}`);
  }
}
