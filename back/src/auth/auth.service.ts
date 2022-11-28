import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
// eslint-disable-next-line prettier/prettier
import { API_SECRET, API_UID, API_URL, APP_LOGIN_REDIRECT, TWOFA_LENGTH } from 'src/constant';
import { Trole } from 'src/users/interfaces/role.type';
import { EUser } from 'src/users/interfaces/user.entity';
import { UsersService } from 'src/users/users.service';
import { randNum } from 'src/utils/utils';
import { Repository } from 'typeorm';
import { ILoginSuccess } from './interfaces/loginSuccess.interface';
import { Etwofa } from './interfaces/twofa.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private twoFaCode: number;

  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(Etwofa)
    private twoFaRepository: Repository<Etwofa>,
  ) {
    this.twoFaCode = Math.floor(10000 + Math.random() * 90000);
  }

  async get42Token(authrozation_code: string) {
    const reqUri: string = API_URL + '/oauth/token';
    Logger.log('POST' + reqUri);
    const reponse = await axios.post(
      reqUri,
      {
        grant_type: 'authorization_code',
        client_id: API_UID,
        client_secret: API_SECRET,
        code: authrozation_code,
        scope: 'public',
        redirect_uri: APP_LOGIN_REDIRECT,
      },
      {
        headers: {
          'content-type': 'application/json',
        },
      },
    );
    return reponse.data;
  }

  async get42LoginWithToken(Token: string): Promise<string> {
    const reqUri: string = API_URL + '/v2/me';
    const reponse = await axios.get(reqUri, {
      headers: {
        Authorization: 'Bearer ' + Token,
      },
    });
    return reponse.data.login;
  }

  deliverToken(login: string, role: Trole): string {
    const payload = { sub: login, role: role };
    return this.jwtService.sign(payload);
  }

  // eslint-disable-next-line prettier/prettier
  async logReponseByLogin(login: string, twofa: 'yes' | 'no' | 'auto' = 'auto'): Promise<ILoginSuccess> {
    let userCreate: boolean;
    let userRole: Trole;
    let userData: EUser;
    if ((userData = await this.userService.findUserByLogin(login))) {
      userRole = userData.role;
      userCreate = false;
    } else {
      userRole = 'user';
      userCreate = true;
      userData = {
        login: login,
        role: userRole,
        isTwoFa: false,
        avatarUrl: '',
        nbLoses: 0,
        nbWins: 0,
      };
      await this.userService.createUser(userData);
    }
    let twofaChoice: boolean;
    if (twofa === 'yes') twofaChoice = true;
    else if (twofa === 'no') twofaChoice = false;
    else twofaChoice = userData.isTwoFa;
    if (twofaChoice) {
      const code: string = randNum(TWOFA_LENGTH);
      const hash: string = await bcrypt.hash(code, 1);
      const expDate: Date = new Date(new Date().getTime() + 1000 * 600);
      const twoFa: Etwofa = {
        login: userData.login,
        code: hash,
        expirationDate: expDate,
      };
      try {
        await this.twoFaRepository.save(twoFa);
      } catch (err) {
        throw err;
      }
    }
    const logSuccess: ILoginSuccess = {
      login: userData.login,
      userCreate: userCreate,
      twofa: twofaChoice,
      apiToken: twofaChoice ? '' : this.deliverToken(login, userRole),
      // eslint-disable-next-line prettier/prettier
      expDate: twofaChoice ? new Date(new Date().getTime() + 1000 * 600): new Date(new Date().getTime() + 1000 * 3600),
    };
    return logSuccess;
  }

  // eslint-disable-next-line prettier/prettier
  async logReponseByCode(code: string, twofa: 'yes' | 'no' | 'auto' = 'auto'): Promise<ILoginSuccess> {
    // eslint-disable-next-line prettier/prettier
    return await this.logReponseByLogin(await this.get42LoginWithToken(await this.get42Token(code)), twofa);
  }

  async checkTwoFaCode(login: string, twoFaCode: string): Promise<boolean> {
    try {
      // eslint-disable-next-line prettier/prettier
      const twofaLine: Etwofa[] = await this.twoFaRepository.find( { where: {login: login}});
      if (twofaLine) {
        const isMatch = await bcrypt.compare(twoFaCode, twofaLine[0].code);
        // eslint-disable-next-line prettier/prettier
        if (new Date(twofaLine[0].expirationDate).getTime() < new Date().getTime())
          return false;
        return isMatch;
      } else throw new Error('Bad login');
    } catch (err) {
      throw err;
    }
  }
}