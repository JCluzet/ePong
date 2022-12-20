import { Injectable, Req, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat, ChatUser } from './chat.entity';
import { comparePassword, encodePassword } from './utils/bcrypt';

@Injectable()
export class ChatService {
  constructor(@InjectRepository(Chat) private readonly ChatRepository: Repository<Chat>, @InjectRepository(ChatUser) private readonly ChatUserRepository: Repository<ChatUser>) {}

  async getChat() {
    let res = await this.ChatRepository.find();
    return res;
  }
  async getChatById(id: number) {
    let res = await this.ChatRepository.findOneBy({
      id: id,
    });
    return res;
  }

  async getChatByuserId(id: number) {
    let res = await this.ChatRepository.findOneBy({
      id: id,
    });
    return res;
  }

  async getChatUser() {
    let res = await this.ChatUserRepository.find();
    return res;
  }
  async getChatUserByChatId(id: number) {
    let res = await this.ChatUserRepository.find();
    let ret: number[] = [];
    res.map((chat: ChatUser) => {
      if (chat.chatId === id) ret.push(chat.userId);
    });
    return ret;
  }

  async getChatUserByUserId(id: number) {
    let res = await this.ChatUserRepository.find();
    let ret: number[] = [];
    res.map((chat: ChatUser) => {
      if (chat.userId === id) ret.push(chat.chatId);
    });
    return ret;
  }

  async getChatAdminByChatId(id: number) {
    let res = await this.ChatUserRepository.findOne({ where: { chatId: id, userType: 0 } });
    return res;
  }

  async getChatAdminByAdminId(id: number) {
    let res = await this.ChatUserRepository.findOne({ where: { userId: id, userType: 0 } });
    return res;
  }

  async getUserType(chanId: number, userId: number) {
    try {
      let res = await this.ChatUserRepository.findOne({ where: { userId: userId, chatId: chanId } });
      return res.userType;
    } catch (error) {
      console.log("Couldn't fetch user type");
      return -2;
    }
  }

  async mouvNameChatById(id: number, name: string) {
    let res = await this.ChatRepository.findOneBy({
      id: id,
    });
    res.name = name;
    await this.ChatRepository.save(res);
    return res;
  }

  async mouvIsPrivateChatById(id: number, isPrivate: boolean) {
    let res = await this.ChatRepository.findOneBy({
      id: id,
    });
    res.isPrivate = isPrivate;
    await this.ChatRepository.save(res);
    return res;
  }

  async mouvIsDirectConvChatById(id: number, isDirectConv: boolean) {
    let res = await this.ChatRepository.findOneBy({
      id: id,
    });
    res.isDirectConv = isDirectConv;
    await this.ChatRepository.save(res);
    return res;
  }

  async mouvPasswordChatById(id: number, password: string) {
    let res = await this.ChatRepository.findOneBy({
      id: id,
    });
    res.password = encodePassword(password);
    await this.ChatRepository.save(res);
    return res;
  }

  async checkPassword(id: number, password: string) {
    let res = await this.ChatRepository.findOneBy({
      id: id,
    });
    return comparePassword(password, res.password);
  }

  async insertChat(name, isPrivate, isDirectConv, password) {
    let res = new Chat();
    res.name = name;
    res.isPrivate = isPrivate;
    res.isDirectConv = isDirectConv;
    res.password = encodePassword(password);
    await this.ChatRepository.save(res);
    return res;
  }

  async insertChatUser(chatId: number, userId: number, userType: number) {
    let chatUser = new ChatUser();
    chatUser.chatId = chatId;
    chatUser.userId = userId;
    chatUser.userType = userType;
    await this.ChatUserRepository.save(chatUser);
    return chatUser;
  }

  async deleteChat(id: number) {
    let res = await this.ChatRepository.findOneBy({
      id: id,
    });
    await this.ChatRepository.save(res);
  }

  async deletChatUserByUserId(userId: number) {
    let res = await this.ChatUserRepository.findOneBy({
      userId: userId,
    });
    await this.ChatUserRepository.remove(res);
  }

  async deletChatUserByChatId(chatId: number) {
    let res = await this.ChatUserRepository.findOneBy({
      chatId: chatId,
    });
    await this.ChatUserRepository.remove(res);
  }

  async deleteUserFromChat(chanId: number, userId: number) {
    let res = await this.ChatUserRepository.findOne({ where: { chatId: chanId, userId: userId } });
    if (res) await this.ChatUserRepository.remove(res);
  }

  async updateUserStatus(userId: number, status: number, chanId: number) {
    let allUsers = await this.ChatUserRepository.find();
    allUsers.forEach((user: ChatUser) => {
      if (user.userId === userId && user.chatId === chanId) {
        user.userType = status;
      }
    });
    this.ChatUserRepository.save(allUsers);
  }

  async addUser(chanId: number, userId: number) {
    let userChans: number[] = await this.getChatUserByUserId(userId);
    for (let i = 0; i < userChans.length; i++) {
      if (userChans[i] == chanId) return false;
    }
    await this.insertChatUser(chanId, userId, 1);
    return true;
  }
}
