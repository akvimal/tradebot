
import { Inject, Injectable, LoggerService, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { ConfirmChannel } from 'amqplib';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { AlertProcessor } from './alert.processor';

@Injectable()
export class AlertConsumer implements OnModuleInit{

  private channelWrapper: ChannelWrapper;
  static ALERT_QUEUE = 'alertQueue';

  constructor(private readonly configService:ConfigService, 
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: LoggerService,
    private readonly processor: AlertProcessor) {
    const connection = amqp.connect([this.configService.get('MESSAGE_URL')]);
    this.channelWrapper = connection.createChannel();
  }

  public async onModuleInit() {
    try {
      await this.channelWrapper.addSetup(async (channel: ConfirmChannel) => {
        await channel.assertQueue(AlertConsumer.ALERT_QUEUE);
        await channel.consume(AlertConsumer.ALERT_QUEUE, async (message) => {
          if (message) {
            const content = JSON.parse(message.content.toString());
            this.logger.log('info','Received message:', content);
            this.processor.processAlert(content);
            channel.ack(message);
          }
        });
      });
      this.logger.log('info','Alert Consumer service started and listening for messages...');
    } catch (err) {
      this.logger.error('error','Error starting the consumer:', err);
    }
  }
  
}