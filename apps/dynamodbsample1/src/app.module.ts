import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/src/common.module';
import { HelloController } from './hello.controller';
import { HelloService } from './hello.service';

@Module({
  imports: [CommonModule],
  controllers: [HelloController],
  providers: [HelloService],
})
export class AppModule {}
