import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsService } from './projects.service';
import { DynamoDbToken } from '../dynamodb/DynamoDbToken';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UpdateCommand } from '@aws-sdk/lib-dynamodb';

describe('ProjectsService', () => {
  let service: ProjectsService;
  const dynamoDbClientMock = {
    send: jest.fn(),
  };
  const configMock = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        {
          provide: DynamoDbToken.DYNAMODB_CLIENT,
          useValue: dynamoDbClientMock,
        },
        {
          provide: ConfigService,
          useValue: configMock,
        },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('incrementBuildNumber', () => {
    it('should validate projectId type', async () => {
      // Act
      const resultPromise = service.incrementBuildNumber(
        1 as unknown as string,
      );

      // Assert
      await expect(resultPromise).rejects.toMatchObject(
        new BadRequestException(),
      );
    });

    it('should return resulting buildNumber', async () => {
      // Arrange
      let calledParam: UpdateCommand | null = null;
      dynamoDbClientMock.send.mockImplementation((param) => {
        calledParam = param;
        return {
          Attributes: {
            buildNumber: 3,
          },
        };
      });

      // Act
      const result = await service.incrementBuildNumber('qqq');

      // Assert
      expect(result).toBe(3);
      expect(calledParam?.input).toMatchObject({
        Key: {
          projectId: 'qqq',
        },
        ReturnValues: 'ALL_NEW',
      });
    });
  });

  describe('getBuildNumber', () => {
    it('should validate projectId type', async () => {
      // Act
      const resultPromise = service.getBuildNumber(1 as unknown as string);

      // Assert
      await expect(resultPromise).rejects.toMatchObject(
        new BadRequestException(),
      );
    });

    it('should return current buildNumber', async () => {
      // Arrange
      let calledParam: UpdateCommand | null = null;
      dynamoDbClientMock.send.mockImplementation((param) => {
        calledParam = param;
        return {
          Item: {
            buildNumber: 3,
          },
        };
      });

      // Act
      const result = await service.getBuildNumber('qqq');

      // Assert
      expect(result).toBe(3);
      expect(calledParam?.input).toMatchObject({
        Key: {
          projectId: 'qqq',
        },
      });
    });

    it('should return not found', async () => {
      // Arrange
      let calledParam: UpdateCommand | null = null;
      dynamoDbClientMock.send.mockImplementation((param) => {
        calledParam = param;
        return {};
      });

      // Act
      const resultPromise = service.getBuildNumber('qqq');

      // Assert
      await expect(resultPromise).rejects.toMatchObject(
        new NotFoundException(),
      );
      expect(calledParam?.input).toMatchObject({
        Key: {
          projectId: 'qqq',
        },
      });
    });
  });

  describe('updateBuildNumber', () => {
    it('should validate projectId type', async () => {
      // Act
      const resultPromise = service.updateBuildNumber(
        1 as unknown as string,
        'ee' as unknown as number,
      );

      // Assert
      await expect(resultPromise).rejects.toMatchObject(
        new BadRequestException('invalid projectId'),
      );
    });

    it('should validate projectId string', async () => {
      // Act
      const resultPromise = service.updateBuildNumber(
        '[]',
        'ee' as unknown as number,
      );

      // Assert
      await expect(resultPromise).rejects.toMatchObject(
        new BadRequestException(
          "projectId should only contain digits, letters, '_' and '-'",
        ),
      );
    });

    it('should validate buildNumber type', async () => {
      // Act
      const resultPromise = service.updateBuildNumber(
        'qqq',
        'ee' as unknown as number,
      );

      // Assert
      await expect(resultPromise).rejects.toMatchObject(
        new BadRequestException('invalid buildNumber'),
      );
    });

    it('should return resulting buildNumber', async () => {
      // Arrange
      let calledParam: UpdateCommand | null = null;
      dynamoDbClientMock.send.mockImplementation((param) => {
        calledParam = param;
        return {
          Attributes: {
            buildNumber: 3,
          },
        };
      });

      // Act
      const result = await service.updateBuildNumber('qqq', 3);

      // Assert
      expect(result).toBe(3);
      expect(calledParam?.input).toMatchObject({
        Key: {
          projectId: 'qqq',
        },
        UpdateExpression: 'SET buildNumber = :buildNumber',
        ExpressionAttributeValues: {
          ':buildNumber': 3,
        },
        ReturnValues: 'ALL_NEW',
      });
    });
  });
});
