import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { TestBed } from '@automock/jest';

describe('ProjectsController', () => {
  let controller: ProjectsController;
  let serviceMock: jest.Mocked<ProjectsService>;

  beforeAll(() => {
    const { unit, unitRef } = TestBed.create(ProjectsController).compile();

    controller = unit;
    serviceMock = unitRef.get(ProjectsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('increment', async () => {
    // Arrange
    serviceMock.incrementBuildNumber.mockResolvedValue(3);

    // Act
    const result = await controller.increment('qqq');

    // Assert
    expect(result).toBe(3);
    expect(serviceMock.incrementBuildNumber).toHaveBeenCalledWith('qqq');
  });

  it('current', async () => {
    // Arrange
    serviceMock.getBuildNumber.mockResolvedValue(3);

    // Act
    const result = await controller.current('qqq');

    // Assert
    expect(result).toBe(3);
    expect(serviceMock.getBuildNumber).toHaveBeenCalledWith('qqq');
  });

  it('update', async () => {
    // Arrange
    serviceMock.updateBuildNumber.mockResolvedValue(3);

    // Act
    const result = await controller.update('qqq', '3');

    // Assert
    expect(result).toBe(3);
    expect(serviceMock.updateBuildNumber).toHaveBeenCalledWith('qqq', 3);
  });
});
