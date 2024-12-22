import { Body, Controller, Get, Inject, LoggerService, Param, Post, Res} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { AlertService } from './services/alert.service';
import { log } from 'console';

@Controller('webhook')
export class WebhookController {

  constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: LoggerService,
    private readonly configService:ConfigService, private readonly alertService: AlertService) { }

    // {
    //   "stocks": "DELHIVERY,SONACOMS,LODHA",
    //   "trigger_prices": "358.5,600.65,1443.9",
    //   "triggered_at": "12:15 pm",
    //   "scan_name": "10min breakout bearish",
    //   "scan_url": "5min-breakout-bearish-2",
    //   "alert_name": "Alert for 10min breakout bearish",
    //   "webhook_url": "http://89.233.104.2:9090/webhook/chartink"
    // }
    
  @Post('/alerts/:provider')
  async alertListener(@Param('provider') provider: string, @Body() payload: any, @Res() res: any) {
    //log the incoming data
    this.logger.log('info',`Alert from: ${provider}`);
    this.logger.log('info',`Alert payload: ${JSON.stringify(payload)}`);

    this.logger.log('info', payload.stocks);
    
    this.alertService.createAlert(payload.alert_name, 
      this.getTimestampWithTime(payload.triggered_at),
      this.formatSecurities(payload.stocks, payload.trigger_prices));
    //validate the incoming data    
    //process the data/triggers
    //read any configuration from the database for the trigger
    //resolve the platform based on the trigger and configuration
    //send the data to the platform
    
    //log the response
    // return {provider, payload};
    res.status(200).send({status:'success'});
  }

  @Post('/broker/:name')
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
  
  getTimestampWithTime(inputTime) {
    const currentDate = new Date();
    
    // Parse time string
    const [time, modifier] = inputTime.split(' ');
    let [hours, minutes] = time.split(':');
    
    if (modifier === 'pm' && hours !== '12') {
        hours = parseInt(hours, 10) + 12;
    }
    if (modifier === 'am' && hours === '12') {
        hours = '00';
    }
    
    const formattedTime = `${hours}:${minutes}:00`;
    
    // Format current date
    const dateString = currentDate.toISOString().split('T')[0];
    
    return `${dateString} ${formattedTime}`;
  }

  formatSecurities(securities,prices) {
    const pricesArray = prices.split(',');
    return securities.split(',').map((security, index) => {
      return {
        symbol: security,
        price: pricesArray[index]
      }
    })
  }

}