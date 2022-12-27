import { Injectable, Logger } from "@nestjs/common";
import * as sendgridMail from "@sendgrid/mail";

@Injectable()
export class MailConfirmService {
  constructor() {
    Logger.log(`apikey mail: ${process.env.MAIL_PASS} `);
    sendgridMail.setApiKey(process.env.MAIL_PASS);
  }

  async sendConfirmedMail(username: string, email: string) {
    try {
      await sendgridMail.send({
        from: "jessydamoiseau@gmail.com",
        to: email,
        subject: "Welcom to Transcnedingz !",
        html: './templates/confirmed.hbs'
      });
    } catch (err) {
      throw err;
    }
  }
  async sendConfirmMail(username: string, email: string, code: string) {
    try {
      await sendgridMail.send({
        from: "jessydamoiseau@gmail.com",
        to: email,
        subject: "Confirm email",
        html: './templates/confirm.hbs'
      });
    } catch (err) {
      throw err;
    }
  }
}
