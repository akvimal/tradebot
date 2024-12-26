import { Order } from "src/modules/shared/order.model";

export interface BrokerService {
    placeOrder(brokerInfo:any,brokerClientInfo:any, order: Order): Promise<any>;   
    getOrder(orderId: string): Promise<any>;
    modifyOrder(order: Order): Promise<any>;
    cancelOrder(orderId: string): Promise<any>;
    cancelAllOrders(): Promise<any>;
    listOrders(): Promise<any>;

    getOrderRequest(order: Order): any;
}