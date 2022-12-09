import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { EFriend } from './interface/friend.entity';

@Injectable()
export class FriendService {
  constructor(
    @InjectRepository(EFriend)
    private friendsRepository: Repository<EFriend>,
    private userRepository: UsersService,
  ) {}

  async getAll(): Promise<EFriend[]> {
    return await this.friendsRepository.find();
  }

  async getByPair(user1: string, user2: string): Promise<EFriend | undefined> {
    const friendsRaw: EFriend[] = await this.friendsRepository.find({
      where: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 },
      ],
    });
    if (friendsRaw[0]) return friendsRaw[0];
    return undefined;
  }
}
