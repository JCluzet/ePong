import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { Module } from "@nestjs/common";
import { join } from "path";
import { MailConfirmService } from "./mailConfirm.service";

@Module({
  imports: [
		MailerModule.forRoot( { 
			transport: {
				host:'smtp.sendgrid.net',
				auth: {
					user: process.env.MAIL_ID,
					pass: process.env.MAIL_PASS,
				}
			},
			template: {
				dir: join( __dirname, '../../templates/' ),
				adapter: new HandlebarsAdapter(),
			}
		} ),
	],
  providers: [MailConfirmService],
  exports: [MailConfirmService],
})
export class MailConfirmModule {}
