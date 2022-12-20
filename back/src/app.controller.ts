import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  async home() {
    return 'ACCUEIL<br/><br/><br/>Nestjs';
  }
}
