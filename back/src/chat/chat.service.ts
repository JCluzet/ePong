import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat, ChatUser } from './chat.entity';

@Injectable()
export class ChatService {
constructor(
    @InjectRepository(Chat) private readonly ChatRepository: Repository<Chat>,
    @InjectRepository(ChatUser) private readonly ChatUserRepository: Repository<ChatUser>,
    ) {}

    // return table with all chats
    async getChatTable(){
        let result = await this.ChatRepository.find();
        return (result);
    }

    // return a channel found by chat ID
    async getChatByChatId(id:number){
        let result = await this.ChatRepository.findOneBy({ id:id });
    }

    // return a channel found by user ID
    async getChatByUserId(id:number){
        let res = await this.ChatRepository.findOneBy({ id:id });
    }

    // return all users of the chats
    async getChatUserTable(){
        let result = await this.ChatUserRepository.find();
        return (result);
    }

    async getChatUserByChatId(id:number){
        let result = await this.ChatUserRepository.find();
        let ret: number[] = [];
        result.map((chat: ChatUser) => {
            if (chat.chatId === id)
                ret.push(chat.userId);
        })
        return (ret);
    } 

}

/*
marco 1
Tatiana 2
Channel 1
Channel 2


id  |   userId  |   chanId | userTpye
1       1           1         Marco is in channel 1
2       1           2         Marco is in channel 2
3       2           2         Tatiana is in channel 2

*/