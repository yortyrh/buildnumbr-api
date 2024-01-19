import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import dynalite from 'dynalite';
import { CreateTableCommand, DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let dynaliteServer: any;

  beforeAll(async () => {
    dynaliteServer = dynalite({ createTableMs: 10 });
    await new Promise((res, rej) => {
      dynaliteServer.listen(8080, (err: unknown) => {
        if (err) {
          rej(err);
        } else {
          res(null);
        }
      });
    });
    const client = new DynamoDBClient({
      apiVersion: 'latest',
      region: 'local',
      endpoint: 'http://localhost:8080',
    });
    const dynamoDbClient = DynamoDBDocumentClient.from(client);
    await dynamoDbClient.send(
      new CreateTableCommand({
        TableName: 'projects-table',
        StreamSpecification: {
          StreamEnabled: false,
        },
        AttributeDefinitions: [
          {
            AttributeName: 'projectId',
            AttributeType: 'S',
          },
        ],
        KeySchema: [
          {
            AttributeName: 'projectId',
            KeyType: 'HASH',
          },
        ],
        ProvisionedThroughput: {
          ReadCapacityUnits: 1,
          WriteCapacityUnits: 1,
        },
      }),
    );
    dynamoDbClient.destroy();
  });

  afterAll(() => {
    dynaliteServer?.close();
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('round trip', async () => {
    await request(app.getHttpServer()).get('/qqq').expect(200).expect('1');
    await request(app.getHttpServer()).get('/qqq').expect(200).expect('2');
    await request(app.getHttpServer()).get('/aaa').expect(200).expect('1');
    await request(app.getHttpServer()).get('/aaa/get').expect(200).expect('1');
    await request(app.getHttpServer()).get('/qqq/get').expect(200).expect('2');
    await request(app.getHttpServer())
      .get('/qqq/set/40')
      .expect(200)
      .expect('40');
    await request(app.getHttpServer()).get('/qqq/get').expect(200).expect('40');
    await request(app.getHttpServer()).get('/qqq').expect(200).expect('41');
  });
});
