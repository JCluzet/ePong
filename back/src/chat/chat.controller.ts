import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Chat } from './chat.entity';
import { ChatService } from './chat.service';
import { UsersService } from '../users/users.service';
import { EUser } from 'src/users/interfaces/user.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService, private userService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('getChansByUserId')
  async takeChat(@Body() data) {
    let res: Chat[] = [];
    let chatUser = await this.chatService.getChatUserByUserId(data.userId);
    for (let i = 0; chatUser[i]; i++) {
      res.push(await this.chatService.getChatById(chatUser[i]));
    }
    return res;
  }

  @UseGuards(AuthGuard('jwt'))
    @Get('getChan')
    async getChan() {
        return await this.chatService.getChat();
    }

  @UseGuards(AuthGuard('jwt'))
  @Post('getChanUsers')
  async getChanUsers(@Body() data){
      let res: EUser[] = [];
      let chatUser = await this.chatService.getChatUserByChatId(data.chanId)
      for (let i = 0; chatUser[i]; i++)
      {
          if (chatUser[i] != "0") {
            let user = await this.userService.findUserByLogin(chatUser[i]);
            user.userType = await this.chatService.getUserType(data.chanId, chatUser[i]);
            res.push(user);
          }
      }
      return (res);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('newChan')
  async createNewChan(@Body() data) {
    const spec = JSON.parse(JSON.stringify(data));
    let newChan = await this.chatService.insertChat(spec.name, spec.isPrivate, spec.isDirectConv, spec.password);
    this.chatService.insertChatUser(newChan.id, spec.adminId, -1);
    spec.users.forEach((user: EUser) => {
      if (user.login !== spec.adminId) this.chatService.insertChatUser(newChan.id, user.login, 1);
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('getChanById')
  async getChanById(@Body() data) {
    return await this.chatService.getChatById(data.chanId);
  }

  @Post('getUserType')
  @UseGuards(AuthGuard('jwt'))
  async getUserType(@Body() body) {
    let ret = await this.chatService.getUserType(body.chanId, body.userId);
    return ret;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('isAdmin')
  async isAdmin(@Body() body) {
    let ret = await this.chatService.getUserType(body.chanId, body.userId);
    if (ret === 0 || ret == -1) return true;
    else return false;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('isMuted')
  async isMuted(@Body() body) {
    let ret = await this.chatService.getUserType(body.chanId, body.userId);
    if (ret === 2) return true;
    else return false;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('isBanned')
  async isBanned(@Body() body) {
    let ret = await this.chatService.getUserType(body.chanId, body.userId);
    if (ret === 3) return true;
    else return false;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('addUser')
  async addUser(@Body() body) {
    let ret = await this.chatService.addUser(body.chanId, body.userId);
    return ret;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('deleteUser')
  async deleteUser(@Body() body) {
    let ret = await this.chatService.deleteUserFromChat(body.chanId, body.userId);
    return ret;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('updateUserStatus')
  async updateUserStatus(@Body() body) {
    let ret = await this.chatService.updateUserStatus(body.userId, body.status, body.chanId);
    return ret;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('changePassword')
  async changePassword(@Body() body) {
    let ret = await this.chatService.mouvPasswordChatById(body.chanId, body.newPassword);
    if (body.newPassword === '') await this.chatService.mouvIsPrivateChatById(body.chanId, false);
    else await this.chatService.mouvIsPrivateChatById(body.chanId, true);
    return ret;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('checkPassword')
  async checkPassword(@Body() body) {
    let ret = await this.chatService.checkPassword(body.chanId, body.password);
    return ret;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('all')
  async getAllChans() {
    let ret = await this.chatService.getChat();
    return ret;
  }
}
