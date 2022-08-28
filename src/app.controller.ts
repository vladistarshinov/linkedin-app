import { Controller, Get } from '@nestjs/common';
import { AppService } from '../../blog/api/src/app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
