import { Module } from '@nestjs/common';
import { DynamoDbToken } from './DynamoDbToken';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [
    {
      provide: DynamoDbToken.DYNAMODB_CLIENT,
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const isTest = config.get<boolean>('JEST_WORKER_ID');
        const client = new DynamoDBClient({
          ...(isTest
            ? {
                apiVersion: 'latest',
                region: 'local',
                endpoint: 'http://localhost:8080',
              }
            : {
                region: config.get<string>('AWS_REGION'),
              }),
        });
        return DynamoDBDocumentClient.from(client);
      },
    },
  ],
  exports: [DynamoDbToken.DYNAMODB_CLIENT],
})
export class DynamodbModule {}
