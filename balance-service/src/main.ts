import { NestFactory } from '@nestjs/core';
import { BalanceModule } from './balance.module';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(BalanceModule);
  const microservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      port: Number(process.env.PORT),
      host: '127.0.0.1',
    },
  });
  app.useGlobalPipes(new ValidationPipe());
  await app.startAllMicroservicesAsync();
  await app.listen(Number(process.env.PORT));
}
bootstrap();
