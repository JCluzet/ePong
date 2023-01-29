import { BadRequestException, Controller, Delete, Get, Post, Query, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { EUser } from 'src/users/interfaces/user.entity';
import { IUserPublicProfile } from 'src/users/interfaces/userPublicProfile.interface';
import { UsersService } from 'src/users/users.service';
import { ConnectionNotFoundError } from 'typeorm';
import { FriendsService } from './friends.service';
import { EFriend } from './interface/friend.entity';
import { IFriendInvite } from './interface/friendInvite.interface';

@Controller('friends')
export class FriendsController {
  constructor(private friendService: FriendsService, private userService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getFriends(@Req() request: any): Promise<IUserPublicProfile[]> {
    try {
      const friends: IUserPublicProfile[] = await this.friendService.getFriends(request.user.sub);
      if (!friends) throw new BadRequestException('User not found');
      return friends;
    } catch (err) {
      throw new ConnectionNotFoundError(err.message);
    }
  }

  @Get('/logins')
  @UseGuards(AuthGuard('jwt'))
  async getFriendLogin(@Req() request: any): Promise<string[]> {
    try {
      const friendsString: string[] = await this.friendService.getFriendsLogin(request.user.sub);
      if (!friendsString) throw new BadRequestException('User not found');
      return friendsString;
    } catch (err) {
      throw new ConnectionNotFoundError(err.message);
    }
  }

  @Get('/get_invite')
  @UseGuards(AuthGuard('jwt'))
  async getFriendInvite(@Req() request: any): Promise<IFriendInvite[]> {
    try {
      const friendInvite: IFriendInvite[] = await this.friendService.getSendInvite(request.user.sub);
      if (!friendInvite) throw new BadRequestException('User not found');
      return friendInvite;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @Get('/get_receive')
  @UseGuards(AuthGuard('jwt'))
  async getFriendReceive(@Req() request: any): Promise<IFriendInvite[]> {
    try {
      const friendReceive: IFriendInvite[] = await this.friendService.getReceiveInvite(request.user.sub);
      if (!friendReceive) throw new BadRequestException('User not found');
      return friendReceive;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @Get('/admin')
  @UseGuards(AuthGuard('jwt'))
  async getAllFriendUser(@Req() request: any): Promise<EFriend[]> {
    try {
      if (request.user.role === 'admin') return await this.friendService.getAll();
      throw new UnauthorizedException();
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @Post('/send')
  @UseGuards(AuthGuard('jwt'))
  async sendInvite(@Req() request: any, @Query('to') to: string) {
    try {
      if (!to) throw new BadRequestException('You must provide a user (?to=login)');
      const receive: EUser | undefined = await this.userService.findUserByLogin(to);
      if (!receive) throw new BadRequestException('User not found');
      return this.friendService.invite(request.user.sub, receive.login);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @Post('/accept')
  @UseGuards(AuthGuard('jwt'))
  async acceptInvite(@Req() request: any, @Query('to') to: string) {
    try {
      if (!to) throw new BadRequestException('You must provide a user (?to=login)');
      const receive: EUser | undefined = await this.userService.findUserByLogin(to);
      if (!receive) throw new BadRequestException('User not found');
      return this.friendService.accept(request.user.sub, receive.login);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @Post('/deny')
  @UseGuards(AuthGuard('jwt'))
  async denyInvite(@Req() request: any, @Query('to') to: string) {
    try {
      if (!to) throw new BadRequestException('You must provide a user (?to=login)');
      const receive: EUser | undefined = await this.userService.findUserByLogin(to);
      if (!receive) throw new BadRequestException('User not found');
      return this.friendService.deny(request.user.sub, receive.login);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @Delete()
  async removeAll() {
    try {
      return await this.friendService.removeAll();
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
