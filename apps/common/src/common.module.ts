import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { ConfigModule } from '@nestjs/config';
import { validate } from './env.validation';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    HealthModule,
    LoggerModule.forRoot(),
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      validate,
    }),
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class CommonModule {}
