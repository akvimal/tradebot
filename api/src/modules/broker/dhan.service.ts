import { Inject, Injectable, LoggerService } from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { BrokerService } from "./broker.service";
import { Order } from "src/modules/shared/order.model";
import { ApiService } from "src/modules/shared/api.service";

@Injectable()
export class DhanBrokerService implements BrokerService {

    constructor (private readonly apiService: ApiService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: LoggerService) {}

    async placeOrder(brokerInfo: any, brokerClientInfo:any, order: any): Promise<any> {
        this.logger.log('info',`Order placed: ${JSON.stringify(order)}`);
        let response = null;
       try {
        response = await this.apiService.postData(`${brokerInfo['tradeApi']}/v2/orders`, 
            this.buildOrderRequest(brokerClientInfo['accountId'], order), {
            "access-token": brokerClientInfo.accessToken,
            "Content-Type": 'application/json'
        });
        return Promise.resolve({orderStatus:response['data']['orderStatus'], orderId:response['data']['orderId']}); 
       } catch (error) {
        return Promise.reject(error)
       }
        
    }

    buildOrderRequest(clientId:any, order:any){
        const brokerOrder = {
            "dhanClientId": clientId,
            "transactionType":order['transType'],
            "exchangeSegment":order['exchSegment'],
            "productType":order['productType'],
            "orderType":order['orderType'],
            "validity":"DAY",
            "securityId":order['securityId'],
            // "tradingSymbol": order['symbol'],
            "quantity": order['entryQty']
        }
        if(order['orderType'] == 'LIMIT')
            brokerOrder['price'] = order['entryPrice'];
        
        return brokerOrder;
        // Sample Template
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