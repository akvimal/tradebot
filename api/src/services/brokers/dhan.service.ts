import { Inject, Injectable, LoggerService } from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";

@Injectable()
export class DhanBrokerService implements BrokerService {

    constructor (@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: LoggerService) {}

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
}

export interface BrokerService {
    placeOrder(order: Order): Promise<any>;   
    getOrder(orderId: string): Promise<any>;
    modifyOrder(order: Order): Promise<any>;
    cancelOrder(orderId: string): Promise<any>;
    cancelAllOrders(): Promise<any>;
    listOrders(): Promise<any>;
}

export interface Order {
    symbol: string;
    quantity: number;
    price: number;
    side: string;
    type: string;
    validity: string;
    product: string;
    triggerPrice: number;
    disclosedQuantity: number;
    stopLoss: number;
    target: number;
    trailingStopLoss: number;
    exchange: string;
    transactionType: string;
    variety: string;
    squareOff: number;
    stopLossPrice: number;
    targetPrice: number;
    trailingStopLossPrice: number;
    tag: string;
    user: string;
    password: string;
    pin: string;
    source: string;
    clientCode: string;
    orderType: string;
    orderCategory: string;
    productType: string;
    duration: string;
    priceType: string;
    triggerPriceType: string;
    discQty: number;
    stopLossTriggerPrice: number;
    targetTriggerPrice: number;
    trailingStopLossTriggerPrice: number;
    validityDate: string;
    squareOffValue: number;
    stopLossValue: number;
    targetValue: number;
    trailingStopLossValue: number;
    exchangeSegment: string;
    // exchangeInstrumentID: string;
    // exchangeTimeStamp: string;
    // exchangeSequenceNumber: string;
    // exchangeOrderID: string;
    // exchangeUserID: string;
    // exchangeBranchID: string;
    // exchangeMemberID: string;
    // exchangeParticipantCode: string;
    // exchangeClientID: string;
    // exchangeProductType: string;
    // exchangeOrderType: string;
    // exchangeOrderCategory: string;
    // exchangeTimeInForce: string;
    // exchangeDisclosedQuantity: number;
    // exchangeOrderQuantity: number;
    // exchangeOrderPrice: number;
    // exchangeTriggerPrice: number;
    // exchangeOrderValidity: string;
    // exchangeOrderStatus: string;
    // exchangeOrderTime: string;
    // exchangeOrderDate: string;
    // exchangeOrderDateTime: string;
    // exchangeOrderExpireDateTime: string;
    // exchangeOrderTransactionType: string;
    // exchangeOrderProductType: string;
    // exchangeOrderPriceType: string;
    // exchangeOrderTriggerPriceType: string;
    // exchangeOrderDisclosedQuantity: number;
    // exchangeOrderStopLossTriggerPrice: number;
    // exchangeOrderTargetTriggerPrice: number;
    // exchangeOrderTrailingStopLossTriggerPrice: number;
    // exchangeOrderSquareOffValue: number;
    // exchangeOrderStopLossValue: number;
}