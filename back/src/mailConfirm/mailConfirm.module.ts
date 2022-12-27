import { Module } from "@nestjs/common";
import { MailConfirmService } from "./mailConfirm.service";

@Module({
  imports: [],
  providers: [MailConfirmService],
  exports: [MailConfirmService],
})
export class MailConfirmModule {}
