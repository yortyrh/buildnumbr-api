import { Callback, Context, Handler } from 'aws-lambda';
import serverless from 'serverless-http';
import { bootstrapApp } from './bootstrap';
import { Logger } from 'nestjs-pino';

let logger: Logger;

async function bootstrap(): Promise<Handler> {
  const app = await bootstrapApp();
  await app.init();
  const expressApp = app.getHttpAdapter().getInstance();
  logger = app.get(Logger);
  return serverless(expressApp);
}

let bootstrappedHandler: Handler;

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  if (!bootstrappedHandler) {
    bootstrappedHandler = await bootstrap();
  }
  if (event.source === 'serverless-plugin-warmup') {
    logger?.log('WarmUp - Lambda is warm!');
    return 'Lambda is warm!';
  }
  return bootstrappedHandler(event, context, callback);
};
