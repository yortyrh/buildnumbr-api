import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class HelloService {
  private readonly logger = new Logger(HelloService.name);

  hello(): string {
    this.logger.log('calling hello world');
    return 'Hello World!!';
  }
}
