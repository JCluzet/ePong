import { BadRequestException, Controller, Get, Query, Req, UnauthorizedException, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { UsersService } from "src/users/users.service";
import { AuthService } from "./auth.service";
import { ILoginSuccess } from "./interfaces/loginSuccess.interface";
import { IRefreshToken } from "./interfaces/refreshToken.interface";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService, private userService: UsersService) {}

  @Get("get_token")
  async getToken(@Query("code") code: string): Promise<ILoginSuccess> {
    try {
      return await this.authService.logReponseByCode(code, "auto");
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  @Get("refresh_token")
  @UseGuards(AuthGuard("jwt"))
  async refreshToken(@Req() req: any): Promise<IRefreshToken> {
    try {
      const token = this.authService.deliverToken(req.user.sub, req.user.role);
      const newToken: IRefreshToken = {
        token: token,
        expDate: new Date(new Date().getTime() + 1000 * 60 * 60),
      };
      return newToken;
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  @Get("twofa/get_token")
  async twofaGetToken(@Query("login") login: string, @Query("code") code: string): Promise<ILoginSuccess> {
    try {
      const goodTwofa = await this.authService.checkTwoFaCode(login, code);
      if (goodTwofa) return await this.authService.logReponseByLogin({ login: login, avatarUrl: "" }, "no");
      else throw new UnauthorizedException("Bad 2FA code");
    } catch (err) {
      throw new UnauthorizedException("Bad 2FA code");
    }
  }
}
