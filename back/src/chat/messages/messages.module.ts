import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './messages.entity';
import { UsersModule } from '../../users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtConstants } from '../../constant';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]),
    AuthModule,
    UsersModule,
    JwtModule.register({
      signOptions: { expiresIn: '1d' },
      secret: JwtConstants.secret,
    }),
  ],
  providers: [MessagesService, AuthService],
  controllers: [MessagesController],
})
export class MessagesModule {}
