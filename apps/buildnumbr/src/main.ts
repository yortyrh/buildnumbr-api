import { ConfigService } from '@nestjs/config';
import { bootstrapApp } from './bootstrap';

async function bootstrap() {
  const app = await bootstrapApp();
  const port = app.get(ConfigService).get<number>('PORT');
  await app.listen(port);
}
bootstrap();
