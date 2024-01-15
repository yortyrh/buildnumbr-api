import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from '@utils/utils/health/health.module';

@Module({
  imports: [
    HealthModule,
    LoggerModule.forRoot(),
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
    }),
  ],
  providers: [],
  exports: [],
})
export class UtilsModule {}
