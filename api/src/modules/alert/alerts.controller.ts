import { Body, Controller, Get, Inject, LoggerService, Param, Post, Res, UseGuards} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { AlertService } from 'src/modules/alert/alert.service';
import { RabbitMQService } from 'src/modules/shared/rabbitmq.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/core/user.decorator';

@Controller('alerts')
@UseGuards(AuthGuard('jwt'))
export class AlertController {

  alerts=[];

  constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: LoggerService,
   private readonly mqService: RabbitMQService, private readonly service: AlertService) {
    //load alerts configured and that are active
    // this.service.findAllAlerts(null).then(data => this.alerts = data);
   }

   @Get('/:alertId/securities')
   async findAllSecurities(@Param('alertId') alertId:number) {
    return await this.service.findAllAlertSecurities(alertId);
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
    
    @Post('/filter')
    async findAll(@Body() criteria: any) {
        return await this.service.findAllAlerts(criteria);
    }

    @Post('/filter/my')
    async findAllMy(@Body() criteria: any, @User() currentUser: any) {
        return await this.service.findAllClientAlerts(currentUser.clients);
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