import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { ChatController } from './chat.controller';
import { Chat, ChatUser } from './chat.entity';
import { ChatService } from './chat.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Chat, ChatUser]),
  ],
  controllers: [ChatController],
  providers: [ChatService, AuthService],
  exports: [ChatService],
})
export class ChatModule {}