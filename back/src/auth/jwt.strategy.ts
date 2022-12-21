import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy, AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { JwtConstants } from '../constant';
import { IJwtPayload } from './interfaces/jwtPayload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JwtConstants.secret,
    });
  }

  async validate(payload: any): Promise<IJwtPayload> {
    return { sub: payload.sub, role: payload.role };
  }
}

@Injectable()
export default class JwtAuthenticationGuard extends AuthGuard('jwt') { }