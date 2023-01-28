import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
      kda: element.win_loss_ratio,
      status: element.status,
      totalGame: element.total_games,
    }));
    return userPublicProfil;
  }

  async findUserByLogin(login: string): Promise<EUser | undefined> {    
    const ret = await this.usersRepository.find({ where: { login: login } });
    if (ret.length) return ret[0];
    return undefined;
  }

	async findUserById(id: number): Promise<EUser | undefined> {
		const ret = await this.usersRepository.find({ where: { id: id }});
		if (ret.length) return ret[0];
		return undefined;
	}

  async findUserByName(name: string): Promise<EUser | undefined> {
    const ret = await this.usersRepository.find({ where: { name: name } });
    if (ret.length) return ret[0];
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
        kda: ret.win_loss_ratio,
        totalGame: ret.total_games,
        status: ret.status,
      };
      return userProfil;
    } catch (err) {
      return undefined;
    }
  }

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
        kda: ret.win_loss_ratio,
        status: ret.status,
        totalGame: ret.total_games,
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
      return true;
    } catch (err) {
      return false;
    }
  }

  async editWithSetting(profileSettings: IProfileSettings): Promise<boolean> {
    try {
      const user: EUser = await this.findUserByLogin(profileSettings.login);
      if (!user) return false;
      if (profileSettings.name === '') user.name = user.login;
      else{
        const sameUser = await this.findUserByName( profileSettings.name );
			  if ( sameUser && sameUser.login !== user.login ) return false;
        user.name = profileSettings.name;
      } 
      user.isTwoFa = profileSettings.isTwoFa;
      user.avatarUrl = profileSettings.avatarUrl;
      await this.usersRepository.save(user);
      return true;
    } catch (err) {
      return false;
    }
  }

  async editGameScore(gameScore: IGameScore): Promise<boolean> {
    try {
      const winner = await this.usersRepository.createQueryBuilder('user').where({ login: gameScore.winner }).getOne();
      const loser = await this.usersRepository.createQueryBuilder('user').where({ login: gameScore.loser }).getOne();
      winner.nbWins++;
      loser.nbLoses++;
      winner.total_games++;
      loser.total_games++;
      winner.win_loss_ratio = (winner.nbWins) / (winner.total_games) * 100;
      loser.win_loss_ratio = (loser.nbWins) / (loser.total_games) * 100;
      this.usersRepository.save(winner);
      this.usersRepository.save(loser);
      return true;
    } catch (err) {
      return false;
    }
  }

  async updateStatus(login: string, s: string) {
    try{
      const user: EUser = await this.findUserByLogin(login);
      if (!user) throw new Error(`User ${login} not found`);
      user.status = s;
      await this.usersRepository.save(user);
    } catch (err) {}
	}

  async checkNameIsValid(login:string, name: string): Promise<boolean>{
    try{
      const user: EUser = await this.findUserByLogin(login);
      if (!user) throw new Error(`User ${login} not found`);
      const sameUser = await this.findUserByName(name);
      if ( sameUser && sameUser.login !== user.login ) throw new Error(`User ${name} already exist`);
      return true;
    } catch (err){
      throw new Error(err);
    }
      
  }
}
