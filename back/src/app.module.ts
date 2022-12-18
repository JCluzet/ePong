import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { EUser } from './users/interfaces/user.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { Etwofa } from './auth/interfaces/twofa.entity';
import { EFriend } from './fiends/interface/friend.entity';
import { FriendsModule } from './fiends/friends.module';
import { BlockController } from './block/block.controller';
import { BlockModule } from './block/block.module';
import { EBlock } from './block/interface/bock.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db-server',
      port: 5432,
      username: 'transcendingz',
      password: 'transcendingz',
      database: 'psql',
      entities: [EUser, Etwofa, EFriend, EBlock],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    FriendsModule,
    ChatModule,
    BlockModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
