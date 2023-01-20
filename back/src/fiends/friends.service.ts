import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IUserPublicProfile } from 'src/users/interfaces/userPublicProfile.interface';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { EFriend } from './interface/friend.entity';
import { IFriendInvite } from './interface/friendInvite.interface';

@Injectable()
export class FriendsService {
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

  async getFriendsLogin(login: string): Promise<string[]> {
    try {
      const friendsRaw: EFriend[] = await this.friendsRepository.find({
        where: [
          { sender: login, status: 'accepted' },
          { receiver: login, status: 'accepted' },
        ],
      });
      const friendString: string[] = friendsRaw.map((element) => {
        if (element.sender !== login) return element.sender;
        else return element.receiver;
      });
      return [...new Set(friendString)];
    } catch (err) {
      throw err;
    }
  }

  async getFriends(login: string): Promise<IUserPublicProfile[]> {
    try {
      const friendLogin: string[] = await this.getFriendsLogin(login);
      const friendPub: IUserPublicProfile[] = [];
      for (const search of friendLogin) {
        const user = await this.userRepository.findUserPublicProfile(search);
        if (user) friendPub.push(user);
      }
      return friendPub;
    } catch (err) {
      throw err;
    }
  }

  async getSendInvite(login: string): Promise<IFriendInvite[]> {
    try {
      const invited: EFriend[] = await this.friendsRepository.find({ where: [{ sender: login, status: 'pending' }] });
      const invite: IFriendInvite[] = invited.map((element: EFriend) => ({
        sender: element.sender,
        receiver: element.receiver,
        status: element.status,
      }));
      return invite;
    } catch (err) {
      throw err;
    }
  }

  async getReceiveInvite(login: string): Promise<IFriendInvite[]> {
    try {
      const received: EFriend[] = await this.friendsRepository.find({ where: [{ receiver: login, status: 'pending' }] });
      const receive: IFriendInvite[] = received.map((element: EFriend) => ({
        sender: element.sender,
        receiver: element.receiver,
        status: element.status,
      }));
      return receive;
    } catch (err) {
      throw err;
    }
  }

  async invite(from: string, to: string): Promise<boolean> {
    try {
      const prevRelation: EFriend = await this.getByPair(from, to);
      let relation: EFriend;
      Logger.log(`check error1 ${prevRelation}`);
      console.log(prevRelation);
      
      if ((prevRelation !== undefined && prevRelation.status === 'pending') || (prevRelation !== undefined && prevRelation.status === 'accepted')) return false;
      else if ( prevRelation ) {
        Logger.log(`check error5`);
				relation = prevRelation;
				relation.sender = from;
				relation.receiver = to;
				relation.status = 'pending';
			} else {
        Logger.log(`check error3`);
				relation = {
					sender: from,
					receiver: to,
					status: 'pending',
				};
			}
      Logger.log(`check error2`);
      await this.friendsRepository.save(relation);
      return true;
    } catch (err) {
      return false;
    }
  }

  async deny(from: string, to: string): Promise<boolean> {
    try {
      const relation: EFriend = await this.getByPair(from, to);
      if (!relation) return false;
      relation.status = 'none';
      await this.friendsRepository.save(relation);
      return true;
    } catch (err) {
      return false;
    }
  }

  async accept(from: string, to: string): Promise<boolean> {
    try {
      const relation: EFriend = await this.getByPair(from, to);
      if (!relation || relation.sender === from) return false;
      relation.status = 'accepted';
      await this.friendsRepository.save(relation);
      return true;
    } catch (err) {
      return false;
    }
  }

  async removeAll(): Promise<boolean> {
    try {
      const all = (await this.getAll()).map((element) => element.id);
      if (all.length) this.friendsRepository.delete(all);
      Logger.log(`friend db removed`);
      return true;
    } catch (err) {
      Logger.log(`Error: friend db remove failled.`);
      return false;
    }
  }
}
