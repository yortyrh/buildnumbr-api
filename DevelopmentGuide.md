# BuildNumbr.com Development Guide
## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Code Formatting

```bash
# prettier
$ npm run format

# eslint
$ npm run lint
```

## Logging

```ts
import { Logger, Injectable } from '@nestjs/common';

@Injectable()
class MyService {
  private readonly logger = new Logger(MyService.name);

  doSomething() {
    this.logger.log('Doing something...');
  }
}
```

## Testing

```ts
import { Test } from '@nestjs/testing';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
import { jest } from '@jest/globals';

describe('CatsController', () => {
  let catsController: CatsController;
  const catsServiceMock = {
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [CatsController],
      providers: [{
        provides: CatsService,
        useValue: catsServiceMock,
      }],
    }).compile();

    catsController = moduleRef.get<CatsController>(CatsController);
  });

  describe('findAll', () => {
    it('should return an array of cats', async () => {
      // Arrange
      const result = ['test'];
      catsServiceMock.findAll.mockImplementation(() => result);

      // Act
      const actual = await catsController.findAll();

      // Assert
      expect(actual).toBe(result);
    });
  });
});
```
