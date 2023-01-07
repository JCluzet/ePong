import { BadRequestException, Body, Controller, Delete, Get, Logger, Param, Post, Query, Req, Res, UnauthorizedException, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { randString } from 'src/utils/utils';
import { extname } from 'path';
import { IGameScore } from './interfaces/gameScore.interface';
import { EUser } from './interfaces/user.entity';
import { IUserProfile } from './interfaces/userProfile.interface';
import { IUserPublicProfile } from './interfaces/userPublicProfile.interface';
import { UsersService } from './users.service';
import { API_AVATAR_GET_URL } from 'src/constant';
import { IProfileSettings } from './interfaces/profileSetting.interface';
import * as fs from 'fs';

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
  // @UseGuards(AuthGuard('jwt'))
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

  @Post('/uploadAvatar')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './upload',
        filename: (req: any, file, callback: Function) => {
          const extension: string = extname(file.originalname);
          const newFilename: string = req.user.sub + randString(3) + extension;
          callback(null, newFilename);
        },
      }),
      // eslint-disable-next-line @typescript-eslint/ban-types
      fileFilter: (req: any, file, callback: Function) => {
        if (file.mimetype.substring(0, 5) !== 'image' && !file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) callback(new BadRequestException('Invalid file type'), false);
        callback(null, true);
      },
    }),
  )
  async uploadImage(@Req() request: any, @UploadedFile() file: Express.Multer.File) {
    try {
      const user = await this.usersService.findUserProfile(request.user.sub);
      if (!user) throw new BadRequestException('User not found');
      

      const avatarsTab = user.avatarUrl.split("/");
      await fs.unlink(`./upload/${avatarsTab[avatarsTab.length - 1]}`, (err) => {});
      
      const userSetting: IProfileSettings = {
        login: user.login,
        name: request.body.name,
        isTwoFa: user.isTwoFa,
        avatarUrl: API_AVATAR_GET_URL + '/' + file.filename,
      };
      Logger.log(`avartrUrl ${userSetting.avatarUrl}, name ${userSetting.name}`);
      this.usersService.editWithSetting(userSetting);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @Get('/avatars/:filename')
  seeUploadedFile(@Param('filename') filename, @Res() res: any) {
    return res.sendFile(filename, { root: './upload' });
  }

  @Get('/checkName')
  @UseGuards(AuthGuard('jwt'))
  async checkName(@Req() request: any, @Query('name') name: string): Promise<boolean>{
    try{
      if (!name) return true;
      return await this.usersService.checkNameIsValid(request.user.sub, name);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @Delete('/reset')
  async removeAll(): Promise<string> {
    await this.usersService.removeAll();
    return `reset to default user`;
  }
}
