import { Test, TestingModule } from '@nestjs/testing';
import { HelloController } from './hello.controller';
import { HelloService } from './hello.service';

describe('HelloController', () => {
  let controller: HelloController;
  let service: jest.Mocked<HelloService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HelloController],
      providers: [
        {
          provide: HelloService,
          useValue: {
            hello: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<HelloController>(HelloController);
    service = module.get(HelloService) as jest.Mocked<HelloService>;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return service hello when controller hello', () => {
    // Arrange
    service.hello.mockReturnValue('hello1');

    // Act
    const result = controller.hello();

    // Assert
    expect(result).toBe('hello1');
  });
});
