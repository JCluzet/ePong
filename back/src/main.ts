import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';

const PORT = process.env.PORT || 5001;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(cors({ origin: '*' }));
  await app.listen(PORT);
}
bootstrap();