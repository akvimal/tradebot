import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import { AlertController } from './modules/alert/alerts.controller';
import { AlertConsumer } from './modules/strategy/alert.consumer';
import { BrokerFactoryService } from './modules/broker/broker-factory.service';
import { DhanBrokerService } from './modules/broker/dhan.service';
import { AlertProcessor } from './modules/strategy/alert.processor';
import { ClientService } from './modules/client/client.service';
import { ClientOrder } from './entities/client-order.entity';
import { BrokerController } from './modules/broker/broker.controller';
import { FeedbackConsumer } from './modules/strategy/feedback.consumer';
import { FeedbackProcessor } from './modules/strategy/feedback.processor';
import { AppUser } from './entities/app-user.entity';
import { AuthController } from './modules/app/auth/auth.controller';
import { AuthService } from './modules/app/auth/auth.service';
import { AuthHelper } from './modules/app/auth/auth.helper';
import { OrdersController } from './modules/order/orders.controller';
import { Alert } from './entities/alert.entity';
import { Client } from './entities/client.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './modules/app/auth/auth.strategy';
import { SignalController } from './modules/alert/signal.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
    }), 
    PassportModule.register({ defaultStrategy: 'jwt', property: 'user' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_KEY'),
        signOptions: { expiresIn: config.get('JWT_EXPIRES') },
      }),
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
    TypeOrmModule.forFeature([Client,Partner,Alert,AlertSecurity,ClientAlert,ClientOrder,AppUser]),
    HttpModule
  ],
  controllers: [AuthController, SignalController, AlertController, BrokerController, OrdersController],
  providers: [AuthService, AuthHelper, ApiService, BrokerFactoryService, DhanBrokerService, RabbitMQService, 
    AlertConsumer, AlertProcessor, AlertService, FeedbackConsumer, FeedbackProcessor, OrderService, ClientService, JwtStrategy],
  exports: []
})
export class AppModule {}