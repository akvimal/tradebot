import { Inject, Injectable, LoggerService } from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { OrderService } from "../order/order.service";

@Injectable()
export class FeedbackProcessor {
    
    constructor (@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: LoggerService,
        private readonly orderService:OrderService){}

    async process(content: any) {
        this.logger.log('info', `Processing feedback: ${JSON.stringify(content)}`);
        //get correlationId, orderId, filled_qty and orderStatus
        try {
            await this.orderService.updateOrder(content['orderId'],content['quantity'],
                content['price'],content['orderStatus'],content['correlationId'],'Broker Postback updated');    
        } catch (error) {
            this.logger.log('info', `Unable to update order ${content['orderId']} with status ${content['orderStatus']}`);    
        }
        
        this.logger.log('info', `Updated order ${content['orderId']} with status ${content['orderStatus']}`);
    }
}