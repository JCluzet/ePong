import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IGameScore } from './interfaces/gameScore.interface';
import { IProfileSettings } from './interfaces/profileSetting.interface';
import { EUser } from './interfaces/user.entity';
import { IUserProfile } from './interfaces/userProfile.interface';
import { IUserPublicProfile } from './interfaces/userPublicProfile.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(EUser)
    private usersRepository: Repository<EUser>,
  ) {}

  findAll(): Promise<EUser[]> {
    return this.usersRepository.find();
  }

  async findAllPublicUser(): Promise<IUserPublicProfile[]> {
    const userPublicProfil: IUserPublicProfile[] = (await this.findAll()).map((element: EUser) => ({
      login: element.login,
      name: element.name,
      nbWins: element.nbWins,
      nbLoses: element.nbLoses,
      avatarUrl: element.avatarUrl,
    }));
    return userPublicProfil;
  }

  async findUserByLogin(login: string): Promise<EUser | undefined> {
    const ret = await this.usersRepository.find({ where: { login: login } });
    if (ret.length) return ret[0];
    Logger.log(`User login: ${login} not found`);
    return undefined;
  }

  async findUserByName(name: string): Promise<EUser | undefined> {
    const ret = await this.usersRepository.find({ where: { name: name } });
    if (ret.length) return ret[0];
    Logger.log(`User name: ${name} not found`);
    return undefined;
  }

  async findUserProfile(login: string): Promise<IUserProfile | undefined> {
    try {
      const ret: EUser | undefined = await this.findUserByLogin(login);
      if (!ret) return undefined;
      const userProfil: IUserProfile = {
        login: ret.login,
        name: ret.name,
        nbWins: ret.nbWins,
        nbLoses: ret.nbLoses,
        isTwoFa: ret.isTwoFa,
        avatarUrl: ret.avatarUrl,
      };
      return userProfil;
    } catch (err) {
      return undefined;
    }
  }

  // eslint-disable-next-line prettier/prettier
  async findUserPublicProfile(login: string): Promise<IUserPublicProfile | undefined> {
    try {
      const ret: EUser | undefined = await this.findUserByLogin(login);
      if (!ret) return undefined;
      const userPublicProfil: IUserPublicProfile = {
        login: ret.login,
        name: ret.name,
        nbWins: ret.nbWins,
        nbLoses: ret.nbLoses,
        avatarUrl: ret.avatarUrl,
      };
      return userPublicProfil;
    } catch (err) {
      return undefined;
    }
  }

  async createUser(user: EUser): Promise<boolean> {
    try {
      await this.usersRepository.save(user);
      return true;
    } catch (err) {
      return false;
    }
  }

  async removeUserByLogin(login: string) {
    try {
      const ret: EUser | undefined = await this.findUserByLogin(login);
      if (ret) this.usersRepository.remove(ret);
      else throw new Error(`User ${login} not found`);
    } catch (err) {
      throw new Error(err);
    }
  }

  async removeAll(): Promise<boolean> {
    try {
      const ids = (await this.findAll()).map((element) => element.id);
      if (ids.length) this.usersRepository.delete(ids);
      Logger.log(`Users db removed`);
      return true;
    } catch (err) {
      Logger.log(`Error: User db remove failled.`);
      return false;
    }
  }

  async editWithSetting(profileSettings: IProfileSettings): Promise<boolean> {
    try {
      const user: EUser = await this.findUserByLogin(profileSettings.login);
      if (!user) return false;
      Logger.log(`twofa: ${profileSettings.isTwoFa}`);
      if (profileSettings.name === '') user.name = user.login;
      else user.name = profileSettings.name;
      user.isTwoFa = profileSettings.isTwoFa;
      user.avatarUrl = profileSettings.avatarUrl;
      await this.usersRepository.save(user);
      Logger.log(`user.avatarUrl ${user.avatarUrl}`);
      return true;
    } catch (err) {
      // eslint-disable-next-line prettier/prettier
      Logger.log(`Error user ${profileSettings.login} edition failed`, profileSettings);
      return false;
    }
  }

  async editGameScore(gameScore: IGameScore): Promise<boolean> {
    try {
      // eslint-disable-next-line prettier/prettier
      const winner = await this.usersRepository.createQueryBuilder('user').where({ login: gameScore.winner }).getOne();
      // eslint-disable-next-line prettier/prettier
      const loser = await this.usersRepository.createQueryBuilder('user').where({ login: gameScore.loser }).getOne();
      winner.nbWins++;
      loser.nbLoses++;
      this.usersRepository.save(winner);
      this.usersRepository.save(loser);
      return true;
    } catch (err) {
      return false;
    }
  }
}
