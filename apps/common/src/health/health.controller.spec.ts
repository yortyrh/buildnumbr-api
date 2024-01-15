import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { HealthCheckService, TerminusModule } from '@nestjs/terminus';

describe('HealthController', () => {
  let controller: HealthController;
  let health: HealthCheckService;
  let healthSpy: jest.SpyInstance;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TerminusModule],
      controllers: [HealthController],
    }).compile();

    controller = module.get(HealthController);
    health = module.get(HealthCheckService);
    healthSpy = jest.spyOn(health, 'check');
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call terminus check', () => {
    // Arrange
    const value = 'the response';
    healthSpy.mockReturnValue(value);

    // Act
    const response = controller.check();

    // Assert
    expect(healthSpy).toHaveBeenCalled();
    expect(response).toBe(value);
  });
});
