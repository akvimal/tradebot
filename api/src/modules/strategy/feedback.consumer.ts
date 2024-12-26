
import { Inject, Injectable, LoggerService, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { ConfirmChannel } from 'amqplib';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { FeedbackProcessor } from './feedback.processor';

@Injectable()
export class FeedbackConsumer implements OnModuleInit{

  private channelWrapper: ChannelWrapper;
  static FEEDBACK_QUEUE = 'feedbackQueue';

  constructor(private readonly configService:ConfigService, 
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: LoggerService,
    private readonly processor: FeedbackProcessor) {
    const connection = amqp.connect([this.configService.get('MESSAGE_URL')]);
    this.channelWrapper = connection.createChannel();
  }

  public async onModuleInit() {
    try {
      await this.channelWrapper.addSetup(async (channel: ConfirmChannel) => {
        await channel.assertQueue(FeedbackConsumer.FEEDBACK_QUEUE);
        await channel.consume(FeedbackConsumer.FEEDBACK_QUEUE, async (message) => {
          if (message) {
            const content = JSON.parse(message.content.toString());
            this.logger.log('info','Broker feedback received:', content);
            this.processor.process(content);
            channel.ack(message);
          }
        });
      });
      this.logger.log('info','Feedback Consumer service started and listening for messages...');
    } catch (err) {
      this.logger.error('error','Error starting the consumer:', err);
    }
  }
  
}