import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import { API_SECRET, API_UID, API_URL, APP_LOGIN_REDIRECT } from 'src/constant';
import { Trole } from 'src/users/interfaces/role.type';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ){};

  async get42Token(authrozation_code: string) {
    const reqUri: string = API_URL + '/oauth/token';
    Logger.log('POST' + reqUri);
    const reponse = await axios.post(
        reqUri,{
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
            }
        }
    );
    return reponse.data;
  }

  async get42LoginWithToken(Token: string): Promise<string> {
    const reqUri: string = API_URL + '/v2/me';
    const reponse = await axios.get(
        reqUri,
        {
            headers: {
                Authorization: 'Bearer ' + Token,
            }
        }
    );
    return reponse.data.login;
  }

  deliverToken(login: string, role: Trole): string {
    const payload = { sub: login, role: role};
    return this.jwtService.sign(payload);
  }

}
