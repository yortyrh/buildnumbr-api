import { Module } from '@nestjs/common';
import { UtilsModule } from '@utils/utils';
import { ProjectsModule } from './projects/projects.module';
import { DynamodbModule } from './dynamodb/dynamodb.module';

@Module({
  imports: [UtilsModule, ProjectsModule, DynamodbModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
