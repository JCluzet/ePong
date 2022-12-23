import { MailerService } from "@nestjs-modules/mailer";
import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class MailConfirmService {
  constructor(private mailerService: MailerService) {}

  async sendConfirmedMail(username: string, email: string) {
    try {
      await this.mailerService.sendMail({
        from: "jessydamoiseau@gmail.com",
        to: email,
        subject: "Welcom to transcendingz !",
        template: "confirmed",
        context: {
          username,
          email,
        },
      });
    } catch (err) {
      throw err;
    }
  }
  async sendConfirmMail(username: string, email: string, code: string) {
    try {
      await this.mailerService.sendMail({
        from: "jessydamoiseau@gmail.com",
        to: email,
        subject: "Confirm connexion !",
        template: "confirm",
        context: {
          username,
          code,
        },
      });
    } catch (err) {
      throw err;
    }
  }
}
