import { BadRequestException, Body, Controller, Get, Param, Post, Req, UnauthorizedException, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IGameScore } from './interfaces/gameScore.interface';
import { EUser } from './interfaces/user.entity';
import { IUserProfile } from './interfaces/userProfile.interface';
import { IUserPublicProfile } from './interfaces/userPublicProfile.interface';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async findUsersPublic(): Promise<IUserPublicProfile[]> {
    return this.usersService.findAllPublicUser();
  }

  @Get('/admin')
  @UseGuards(AuthGuard('jwt'))
  async findUserAll(@Req() request: any): Promise<EUser[]> {
    try {
      if (request.user.role === 'admin') return this.usersService.findAll();
      throw new UnauthorizedException();
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @Get('/profile/:login')
  @UseGuards(AuthGuard('jwt'))
  async findProfilByLogin(@Param('login') login: string, @Req() request: any): Promise<IUserProfile> {
    try {
      if (!login) throw new BadRequestException(`Miss login`);
      if (request.user.role === 'admin' || request.user.sub === login) {
        const userProfil: IUserProfile | undefined = await this.usersService.findUserProfile(login);
        if (!userProfil) throw new BadRequestException(`User not found`);
        return userProfil;
      }
      throw new UnauthorizedException();
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @Get('/public/:login')
  @UseGuards(AuthGuard('jwt'))
  async findUserPublic(@Param('login') login: string): Promise<IUserPublicProfile> {
    try {
      if (!login) throw new BadRequestException(`Miss Login`);
      const userProfil: IUserPublicProfile | undefined = await this.usersService.findUserPublicProfile(login);
      if (!userProfil) throw new BadRequestException(`User not found`);
      return userProfil;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @Get('/avatar/:filename')
  seeUploadFile(@Param('filename') filename: string, @Req() req: any) {
    return req.sendFile(filename, { root: './upload' });
  }

  @Post('/edit')
  @UseGuards(AuthGuard('jwt'))
  async edit(@Req() request: any) {
    try {
      if (request.user.role === 'admin' || request.user.sub === request.body.login) {
        this.usersService.editWithSetting(request.body);
        return;
      }
      throw new UnauthorizedException();
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @Post('/game')
  @UseGuards(AuthGuard('jwt'))
  async updateGameScore(@Body() score: IGameScore) {
    try {
      const winner = await this.usersService.findUserProfile(score.winner);
      const loser = await this.usersService.findUserProfile(score.loser);
      if (!winner || !loser) throw new BadRequestException('User not found');
      await this.usersService.editGameScore(score);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
