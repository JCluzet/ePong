import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IProfilSettings } from './interfaces/profileSetting.interface';
import { EUser } from './interfaces/user.entity';
import { IUserProfil } from './interfaces/userProfil.interface';
import { IUserPublicProfil } from './interfaces/userPublicProfil.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(EUser)
    private usersRepository: Repository<EUser>,
  ) {}

  findAll(): Promise<EUser[]> {
    return this.usersRepository.find();
  }

  async findUserByLogin(login: string): Promise<EUser | undefined> {
    const ret = await this.usersRepository.find({ where: { login: login } });
    if (ret.length) return ret[0];
    Logger.log(`User ${login} not found`);
    return undefined;
  }

  async findUserProfil(login: string): Promise<IUserProfil | undefined> {
    try {
      const ret: EUser | undefined = await this.findUserByLogin(login);
      if (!ret) return undefined;
      const userProfil: IUserProfil = {
        login: ret.login,
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
  async findUserPublicProfil(login: string): Promise<IUserPublicProfil | undefined> {
    try {
      const ret: EUser | undefined = await this.findUserByLogin(login);
      if (!ret) return undefined;
      const userPublicProfil: IUserPublicProfil = {
        login: ret.login,
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

  async editWithSetting(profileSettings: IProfilSettings): Promise<boolean> {
    try {
      const user: EUser = await this.findUserByLogin(profileSettings.login);
      if (!user) return false;
      user.isTwoFa = profileSettings.istwofa;
      user.avatarUrl = profileSettings.avatarUrl;
      await this.usersRepository.save(user);
      return true;
    } catch (err) {
      // eslint-disable-next-line prettier/prettier
      Logger.log(`Error user ${profileSettings.login} edition failed`, profileSettings);
      return false;
    }
  }
}
