import { Module } from '@nestjs/common';
import { HelloController } from './hello.controller';
import { HelloService } from './hello.service';
import { UtilsModule } from '@utils/utils';

@Module({
  imports: [UtilsModule],
  controllers: [HelloController],
  providers: [HelloService],
})
export class AppModule {}
