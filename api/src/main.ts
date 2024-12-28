import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { HttpService } from '@nestjs/axios';
import { InternalServerErrorException } from '@nestjs/common';

async function bootstrap() {
  
  const httpService = new HttpService();
  
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // httpService.axiosRef.interceptors.response.use(
  //   (response) => {
  //     return response;
  //   },
  //   (error) => {
  //     console.error('Internal server error exception', error.message);
  //     throw new InternalServerErrorException();
  //   },
  // );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();