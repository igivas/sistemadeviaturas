import IMailProvider from '../../../providers/MailProvider/models/IMailProvider';
import ISendMailDto from '../../../providers/MailProvider/dtos/ISendMailDTO';

export default class FakeMailProvider implements IMailProvider {
  private messages: ISendMailDto[] = [];

  public async sendMail(message: ISendMailDto): Promise<void> {
    this.messages.push(message);
  }
}
