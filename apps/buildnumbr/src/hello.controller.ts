import { Controller, Get, Logger } from '@nestjs/common';
import { HelloService } from './hello.service';

@Controller('hello')
export class HelloController {
  private readonly logger = new Logger(HelloController.name);

  constructor(private readonly helloService: HelloService) {}

  @Get()
  hello(): string {
    this.logger.log('calling hello world controller');
    return this.helloService.hello();
  }
}
