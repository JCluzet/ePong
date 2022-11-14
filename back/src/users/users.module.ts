import { Get, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EUser } from './interfaces/user.entity';
import { IUserPublicProfil } from './interfaces/userPublicProfil.interface';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([EUser])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {
  constructor(private usersService: UsersService) {}

  // @Get()
  // async findUserPublic(): Promise<IUserPublicProfil[]> {
  //   return this.usersService.find
  // }
}
