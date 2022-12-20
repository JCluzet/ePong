import { BadRequestException, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { EUser } from 'src/users/interfaces/user.entity';
import { UsersService } from 'src/users/users.service';
import { ConnectionNotFoundError } from 'typeorm';
import { BlockService } from './block.service';

@Controller('block')
export class BlockController {
  constructor(private blockService: BlockService, private userService: UsersService) {}

  @Get('/:login')
  @UseGuards(AuthGuard('jwt'))
  async getBlockByLogin(@Param('login') login: string): Promise<string[] | undefined> {
    try {
      const userblocks: string[] | undefined = await this.blockService.getBlocked(login);
      if (!userblocks) throw new BadRequestException('No User');
      return userblocks;
    } catch (err) {
      throw new ConnectionNotFoundError(err.message);
    }
  }

  @Post('/block')
  @UseGuards(AuthGuard('jwt'))
  async sendBlockUser(@Req() request: any, @Query('to') to: string) {
    try {
      if (!to) throw new BadRequestException('You must provide a user (?to=login)');
      const user: EUser | undefined = await this.userService.findUserByLogin(to);
      if (!user) throw new BadRequestException(`Unknown User: ${to}`);
      await this.blockService.blockUser(request.user.sub, user.login);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @Post('/unblock')
  @UseGuards(AuthGuard('jwt'))
  async unblockUser(@Req() request: any, @Query('to') to: string) {
    try {
      if (!to) throw new BadRequestException('You must provide a user (?to=login)');
      const user: EUser | undefined = await this.userService.findUserByLogin(to);
      if (!user) throw new BadRequestException(`Unknown User: ${to}`);
      await this.blockService.unblockUser(request.user.sub, user.login);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
