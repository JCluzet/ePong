import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Message, MessageModel } from './messages.entity';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  // @UseGuards(AuthGuard('jwt'))
  @Get('all')
  async all(): Promise<Message[]> {
    return await this.messagesService.all();
  }

  // @UseGuards(AuthGuard('jwt'))
  @Post('newMessage')
  async newMessage(@Body() data: MessageModel) {
    return await this.messagesService.createChanMessage(data);
  }

  // @UseGuards(AuthGuard('jwt'))
  @Post('getOldMessages')
  async getChanOldMessages(@Body() body): Promise<Message[]> {
    return await this.messagesService.findChanMessages(body.chanId);
  }
}
