import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDbToken } from '../dynamodb/DynamoDbToken';
import {
  GetCommand,
  GetCommandInput,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { UpdateCommandInput } from '@aws-sdk/lib-dynamodb/dist-types/commands/UpdateCommand';

export const PROJECTS_TABLE_KEY = 'PROJECTS_TABLE';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly configService: ConfigService,
    @Inject(DynamoDbToken.DYNAMODB_CLIENT)
    private readonly dynamoDbClient: DynamoDBClient,
  ) {}

  /**
   * Create the project if it doesnt exist with the build number 1
   * Update the project if exist to increment the build number
   * @param projectId
   */
  async incrementBuildNumber(projectId: string): Promise<number> {
    if (typeof projectId !== 'string') {
      throw new BadRequestException();
    }

    const incrementParams = {
      TableName: this._getTableName(),
      Key: {
        projectId,
      },
      UpdateExpression:
        'SET buildNumber = if_not_exists(buildNumber, :initial) + :increment',
      ExpressionAttributeValues: {
        ':initial': 0,
        ':increment': 1,
      },
      ReturnValues: 'ALL_NEW',
    } as UpdateCommandInput;

    const result = await this.dynamoDbClient.send(
      new UpdateCommand(incrementParams),
    );
    return result.Attributes.buildNumber;
  }

  /**
   * Get the current build number
   * @param projectId
   */
  async getBuildNumber(projectId: string): Promise<number> {
    if (typeof projectId !== 'string') {
      throw new BadRequestException();
    }

    const params = {
      TableName: this._getTableName(),
      Key: {
        projectId,
      },
    } as GetCommandInput;

    const { Item } = await this.dynamoDbClient.send(new GetCommand(params));
    if (Item) {
      return Item.buildNumber;
    }
    throw new NotFoundException();
  }

  /**
   * Update the project build number.
   * @param projectId
   * @param buildNumber
   */
  async updateBuildNumber(
    projectId: string,
    buildNumber: number,
  ): Promise<number> {
    if (typeof projectId !== 'string') {
      throw new BadRequestException('invalid projectId');
    }

    if (!/[\da-zA-Z\-_ ]+/.test(projectId)) {
      throw new BadRequestException(
        "projectId should only contain digits, letters, '_' and '-'",
      );
    }

    if (typeof buildNumber !== 'number') {
      throw new BadRequestException('invalid buildNumber');
    }

    const updateParams = {
      TableName: this._getTableName(),
      Key: {
        projectId,
      },
      UpdateExpression: 'SET buildNumber = :buildNumber',
      ExpressionAttributeValues: {
        ':buildNumber': buildNumber,
      },
      ReturnValues: 'ALL_NEW',
    } as UpdateCommandInput;

    const { Attributes } = await this.dynamoDbClient.send(
      new UpdateCommand(updateParams),
    );
    return Attributes.buildNumber;
  }

  private _getTableName() {
    return this.configService.get<string>(PROJECTS_TABLE_KEY);
  }
}
