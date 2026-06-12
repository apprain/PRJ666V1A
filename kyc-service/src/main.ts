import { NestFactory } from '@nestjs/core';
import { json, urlencoded } from 'express';
import { AppModule } from './app.module';

import * as fs from 'fs';

async function bootstrap() {

  const httpsOptions = {
    key: fs.readFileSync('./ssl/key.pem'),
    cert: fs.readFileSync('./ssl/cert.pem'),
  };

  const app = await NestFactory.create(AppModule, {
    httpsOptions,
  });

  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ extended: true, limit: '10mb' }));

  app.enableCors({
    origin: true,
    credentials: true,
  });

  const port = process.env.PORT ?? 4000;

  await app.listen(port, '0.0.0.0');

  console.log('HTTPS Running');
  console.log(`https://localhost:${port}`);

  // await app.listen(process.env.PORT ?? 4000);

  // console.log('HTTPS Running');
  // console.log('https://localhost:4000');
}

bootstrap();