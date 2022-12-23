import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtConstants } from 'src/constant';
import { MailConfirmModule } from 'src/mailConfirm/mailConfirm.module';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Etwofa } from './interfaces/twofa.entity';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([Etwofa]),
    JwtModule.register({
      secret: JwtConstants.secret,
      signOptions: { expiresIn: '1h' },
    }),
    UsersModule,
    MailConfirmModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
