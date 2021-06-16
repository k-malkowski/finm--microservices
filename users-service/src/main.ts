import { NestFactory } from '@nestjs/core';
import { UsersModule } from './users.module';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UsersModule,
    {
      transport: Transport.TCP,
      options: {
        port: Number(process.env.PORT),
        host: '127.0.0.1',
      },
    },
  );
  app.useGlobalPipes(new ValidationPipe());
  app.listen(() => console.log('Users-service is listening'));
}
bootstrap();
