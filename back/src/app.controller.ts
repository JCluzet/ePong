import { Controller, Delete, Get } from "@nestjs/common";
import { FriendsService } from "./fiends/friends.service";
import { GameHistoryService } from "./gameHistory/gameHistory.service";
import { UsersService } from "./users/users.service";

@Controller()
export class AppController {
  constructor(
    private userService: UsersService,
    private friendService: FriendsService,
    private gameHistoryService: GameHistoryService) {}
  
  @Get()
  async home() {
    return 'ACCUEIL<br/><br/><br/>Nestjs';
  }

  // @Delete("/reset")
  // async Allreset() {
  //   try{
  //     await this.userService.removeAll();
  //     await this.friendService.removeAll();
  //     await this.gameHistoryService.removeAll();
  //   } catch (err) {
  //     throw new Error(err);
  //   }
  // }
}
