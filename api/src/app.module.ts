import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { utilities as nestWinstonModuleUtilities, WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { transports, format } from 'winston';

import { TypeOrmConfigService } from './config/typeorm-config.service';

import { Partner } from './entities/partner.entity';
import { AlertSecurity } from './entities/alert-security.entity';
import { ClientAlert } from './entities/client-alert.entity';

import { AlertService } from './modules/alert/alert.service';
import { RabbitMQService } from './modules/shared/rabbitmq.service';
import { ApiService } from './modules/shared/api.service';
import { OrderService } from './modules/order/order.service';
import { AlertController } from './modules/alert/alert.controller';
import { AlertConsumer } from './modules/strategy/alert.consumer';
import { BrokerFactoryService } from './modules/broker/broker-factory.service';
import { DhanBrokerService } from './modules/broker/dhan.service';
import { AlertProcessor } from './modules/strategy/alert.processor';
import { ClientService } from './modules/client/client.service';
import { ClientOrder } from './entities/client-order.entity';
import { BrokerController } from './modules/broker/broker.controller';
import { FeedbackConsumer } from './modules/strategy/feedback.consumer';
import { FeedbackProcessor } from './modules/strategy/feedback.processor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
    }),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike('Tradebot', {
              colors: true,
              prettyPrint: true,
              processId: true,
              appName: true,
            }),
          ),
        }),
        new transports.File({
          filename: `${process.env.LOG_FOLDER}/error.log`,
          level: 'error',
          format: format.combine(format.timestamp(), format.json()),
        }),
        new transports.File({
          filename: `${process.env.LOG_FOLDER}/combined.log`,
          format: format.combine(format.timestamp(), format.json()),
        })
      ],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    TypeOrmModule.forFeature([Partner,AlertSecurity,ClientAlert,ClientOrder]),
    HttpModule
  ],
  controllers: [AlertController, BrokerController],
  providers: [ApiService, BrokerFactoryService, DhanBrokerService, RabbitMQService, 
    AlertConsumer, AlertProcessor, AlertService, FeedbackConsumer, FeedbackProcessor, OrderService, ClientService],
  exports: []
})
export class AppModule {}
