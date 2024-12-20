import { Body, Controller, Get, Inject, LoggerService, Param, Post, Res} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Controller('webhook')
export class WebhookController {

  constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: LoggerService) { }

  @Post(':provider')
  async listen(@Param('provider') provider: string, @Body() payload: any, @Res() res: any) {
    //log the incoming data
    this.logger.log('info',`provider: ${provider}`);
    this.logger.log('info',`payload: ${JSON.stringify(payload)}`);
    //validate the incoming data    
    //process the data/triggers
    //read any configuration from the database for the trigger
    //resolve the platform based on the trigger and configuration
    //send the data to the platform
    
    //log the response
    // return {provider, payload};
    res.status(200).send({status:'success', message:'webhook received'});
  }
  
}