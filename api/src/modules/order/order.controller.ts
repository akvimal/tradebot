import { Body, Controller, Inject, LoggerService, Param, Post, Res } from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { RabbitMQService } from "src/modules/shared/rabbitmq.service";

@Controller('order')
export class OrderController {

  constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: LoggerService,
   private readonly mqService: RabbitMQService) { }

    @Post('/feedback/:name')
     async brokerResponse(@Param('name') name: string, @Body() payload: any, @Res() res: any) {
       //log the incoming data
       this.logger.log('info',`broker: ${name}`);
       this.logger.log('info',`payload: ${JSON.stringify(payload)}`);
       // this.logger.log('info', this.configService.get('DHAN_API'));
   
       //validate the incoming data    
       //process the data/triggers
       //read any configuration from the database for the trigger
       //resolve the platform based on the trigger and configuration
       //send the data to the platform
       
       //log the response
       // return {provider, payload};
       res.status(200).send({status:'success'});
     }
}