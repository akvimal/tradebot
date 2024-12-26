import { Body, Controller, Inject, LoggerService, Param, Post, Res } from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { RabbitMQService } from "src/modules/shared/rabbitmq.service";
import { FeedbackConsumer } from "../strategy/feedback.consumer";

@Controller('broker')
export class BrokerController {

  constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: LoggerService,
   private readonly mqService: RabbitMQService) { }

    @Post('/feedback/:name')
     async brokerResponse(@Param('name') name: string, @Body() payload: any, @Res() res: any) {
       //log the incoming data
       
       this.logger.log('info',`${name} postback: ${JSON.stringify(payload)}`);
    //    {
    //     "dhanClientId": "1000000003",
    //     "orderId": "112111182198",
    //     "correlationId":"123abc678",
    //     "orderStatus": "PENDING",
    //     "transactionType": "BUY",
    //     "exchangeSegment": "NSE_EQ",
    //     "productType": "INTRADAY",
    //     "orderType": "MARKET",
    //     "validity": "DAY",
    //     "tradingSymbol": "",
    //     "securityId": "11536",
    //     "quantity": 5,
    //     "disclosedQuantity": 0,
    //     "price": 0.0,
    //     "triggerPrice": 0.0,
    //     "afterMarketOrder": false,
    //     "boProfitValue": 0.0,
    //     "boStopLossValue": 0.0,
    //     "legName": ,
    //     "createTime": "2021-11-24 13:33:03",
    //     "updateTime": "2021-11-24 13:33:03",
    //     "exchangeTime": "2021-11-24 13:33:03",
    //     "drvExpiryDate": null,
    //     "drvOptionType": null,
    //     "drvStrikePrice": 0.0,
    //     "omsErrorCode": null,
    //     "omsErrorDescription": null
    // }
   
      this.mqService.publishMessage(FeedbackConsumer.FEEDBACK_QUEUE, {...payload, broker:name}).catch(error => this.logger.log('error',error));

       res.status(200).send({status:'success'});
     }
}