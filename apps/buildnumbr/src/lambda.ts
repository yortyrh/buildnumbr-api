import { Callback, Context, Handler } from 'aws-lambda';
import serverless from 'serverless-http';
import { bootstrapApp } from './bootstrap';

async function bootstrap(): Promise<Handler> {
  const app = await bootstrapApp();
  await app.init();
  const expressApp = app.getHttpAdapter().getInstance();
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
  return bootstrappedHandler(event, context, callback);
};
