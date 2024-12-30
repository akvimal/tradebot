import { Body, Controller, Get, Inject, LoggerService, Param, Post, Res, UseGuards} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { AlertService } from 'src/modules/alert/alert.service';
import { RabbitMQService } from 'src/modules/shared/rabbitmq.service';
import { AlertConsumer } from '../strategy/alert.consumer';

@Controller('signal')
export class SignalController {

  alerts=[];

  constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: LoggerService,
   private readonly mqService: RabbitMQService, private readonly service: AlertService) {
    //load alerts configured and that are active
    this.service.findAllAlerts(null).then(data => this.alerts = data);
   }


    // {
    //   "stocks": "DELHIVERY,SONACOMS,LODHA",
    //   "trigger_prices": "358.5,600.65,1443.9",
    //   "triggered_at": "12:15 pm",
    //   "scan_name": "10min breakout bearish",
    //   "scan_url": "5min-breakout-bearish-2",
    //   "alert_name": "Alert for 10min breakout bearish",
    //   "webhook_url": "http://89.233.104.2:9090/webhook/chartink"
    // }
    

  @Post('/:provider')
  async alertListener(@Param('provider') provider: string, @Body() payload: any, @Res() res: any) {
    //log the incoming data
    
    this.logger.log('info',`[${provider}]: ${JSON.stringify(payload)}`);
    const alert = this.alerts.find(a => a.name === payload.alert_name);

    if(!alert){
      this.logger.log('info', `Alert[${payload.alert_name}] not configured`);
    }
    else {
      this.formatSecurities(payload.stocks, payload.trigger_prices).forEach(async (security) => {
        try {
          const alert_sec_id = await this.service.createAlertEntry(alert.id, this.getTimestampWithTime(payload.triggered_at), security.symbol,security.price);
          // this.logger.log('info',`Alert created [${alert_sec_id}]`);
          this.mqService.publishMessage(AlertConsumer.ALERT_QUEUE, alert_sec_id).catch(error => this.logger.log('error',error));  
        } catch (error) {
          // this.logger.log('error', `Unable to save ALERT_SECURITY_INFO for ${payload.alert_name} with symbol ${security.symbol}`)
          this.logger.log('error', error.message);
        }
      });
    }
    //validate the incoming data    
    //process the data/triggers
    //read any configuration from the database for the trigger
    //resolve the platform based on the trigger and configuration
    //send the data to the platform
    
    //log the response
    // return {provider, payload};
    res.status(200).send({status:'received'});
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