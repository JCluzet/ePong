import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message, MessageModel } from './messages.entity';

@Injectable()
export class MessagesService {
  constructor(@InjectRepository(Message) private readonly messageRepository: Repository<Message>) {}

  async all(): Promise<Message[]> {
    return this.messageRepository.find();
  }

  async findChanMessages(id): Promise<Message[]> {
    const msgs = await this.messageRepository.find({ where: { chanId: id } });
    return msgs;
  }

  async createChanMessage(data: MessageModel): Promise<Message> {
    const ret = await this.messageRepository.save(data);
    return ret;
  }
}
