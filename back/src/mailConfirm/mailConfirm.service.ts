import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailConfirmService {
  constructor (private mailerService: MailerService) {}

  async sendConfirmMail(username: string, email: string, code: string) {

    try {
      await this.mailerService.sendMail({
        from: process.env.MAIL_FROM,
        to: email,
        subject: "Confirm connexion !",
        template: 'confirm',
        context: {
          username,
          code,
        }
      });
    } catch (err) {
      throw err;
    }
  }
}