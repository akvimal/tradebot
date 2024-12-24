import { Inject, Injectable, LoggerService } from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { BrokerService } from "./broker.service";
import { Order } from "src/modules/shared/order.model";
import { ApiService } from "src/modules/shared/api.service";

@Injectable()
export class DhanBrokerService implements BrokerService {

    constructor (private readonly apiService: ApiService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: LoggerService) {}

    placeOrder(order: Order): Promise<any> {
        this.logger.log('info',`Order placed: ${JSON.stringify(order)}`);
        return Promise.resolve({status:'success'});
    }

    getOrder(orderId: string): Promise<any> {
        this.logger.log('info',`Order details: ${orderId}`);
        return Promise.resolve({status:'success'});
    }

    modifyOrder(order: Order): Promise<any> {
        this.logger.log('info',`Order modified: ${JSON.stringify(order)}`);
        return Promise.resolve({status:'success'});
    }

    cancelOrder(orderId: string): Promise<any> {
        this.logger.log('info',`Order cancelled: ${orderId}`);
        return Promise.resolve({status:'success'});
    }

    cancelAllOrders(): Promise<any> {
        this.logger.log('info',`All orders cancelled`);
        return Promise.resolve({status:'success'});
    }

    listOrders(): Promise<any> {
        this.logger.log('info',`List orders`);
        return Promise.resolve({status:'success'});
    }

    getOrderRequest(order: Order) {
        // {
        //     "dhanClientId":"1000000003",
        //     "correlationId":"123abc678",
        //     "transactionType":"BUY",
        //     "exchangeSegment":"NSE_EQ",
        //     "productType":"INTRADAY",
        //     "orderType":"MARKET",
        //     "validity":"DAY",
        //     "securityId":"11536",
        //     "quantity":"5",
        //     "disclosedQuantity":"",
        //     "price":"",
        //     "triggerPrice":"",
        //     "afterMarketOrder":false,
        //     "amoTime":"",
        //     "boProfitValue":"",
        //     "boStopLossValue": ""
        // }
        return {
            dhanClientId: order.clientId,
            transactionType:order.transactionType,
            exchangeSegment: 'NSE_EQ',
            productType: order.productType,
            orderType: order.orderType,
            validity: order.validity,
            securityId: order.securityId,   
            tradingSymbol: order.symbol,
            quantity: order.quantity,
            price: order.price,
        }
    }
}