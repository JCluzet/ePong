import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat, ChatUser } from './chat.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Chat, ChatUser]), UsersModule],
  providers: [ChatService],
  controllers: [ChatController],
})
export class ChatModule {}
