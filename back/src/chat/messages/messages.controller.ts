import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Message, MessageModel } from './messages.entity';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @Get('all')
  @UseGuards(AuthGuard('jwt'))
  async all(): Promise<Message[]> {
    return await this.messagesService.all();
  }

  @Post('newMessage')
  @UseGuards(AuthGuard('jwt'))
  async newMessage(@Body() data: MessageModel) {
    return await this.messagesService.createChanMessage(data);
  }

  @Post('getOldMessages')
  @UseGuards(AuthGuard('jwt'))
  async getChanOldMessages(@Body() body): Promise<Message[]> {
    return await this.messagesService.findChanMessages(body.chanId);
  }
}
