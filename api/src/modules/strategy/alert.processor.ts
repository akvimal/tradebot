import { Inject, Injectable, LoggerService } from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import * as moment from "moment"; 

import { AlertService } from "../alert/alert.service";
import { OrderService } from "../order/order.service";
import { BrokerFactoryService } from "../broker/broker-factory.service";

import { ClientAlert } from "src/entities/client-alert.entity";

@Injectable()
export class AlertProcessor {
    
    constructor (@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: LoggerService,
        private readonly alertService:AlertService, 
        private readonly orderService:OrderService, 
        private readonly brokerFactoryService:BrokerFactoryService){}

    async process(id: number) {
        this.logger.log('info',`Processing alert entry for ${id}`);
        const alertInfo = await this.alertService.findAlertSecurity(id);
        this.logger.log('info',`Alert Security Info: ${JSON.stringify(alertInfo)}`);
        //get client alerts for the partner and alert
        const clientAlerts = await this.alertService.findClientAlerts(alertInfo['alert']['id']);
        
        //get the security id for the symbol
        // console.log(secInfo);
        // {
        //   security_id: '3220',
        //   underlying_symbol: 'LODHA',
        //   display_name: 'Macrotech Developers'
        // }
        clientAlerts.forEach(async (ca) => {
            // console.log(ca);
            
            const secInfo = (await this.alertService.findSecurityMaster(ca['config']['exchange'], ca['config']['segment'], alertInfo.symbol))[0];
            //get client order, if not exist create one
            const order = await this.orderService.findOrder(ca['clientPartner']['clientId'], 
                ca['config']['exchange'],ca['config']['segment'], alertInfo['symbol'], 'OPEN');
            
            if(!order){
                if(ca['config']['entry']['productType'] !== 'INTRADAY' || 
                    (ca['config']['entry']['productType'] === 'INTRADAY')){
                
                        if(!this.isWithInConfiguredTimeWindow(ca['config']['entry']['intraday'])){
                            this.logger.log('warn', 'INTRADAY time window not allowed');
                            return;
                        }
                    //create new order within time window

                    const newOrder = this.buildInitialOrder(ca,alertInfo,secInfo);
                    if(newOrder.entryQty > 0){
                        if(ca.isLive){
                            //call the appropriate broker service with new order
                            const brokerService = this.brokerFactoryService.getBroker(ca['clientPartner']['partner']['name']);
                            try {
                                const brokerOrderResponse = await brokerService.placeOrder(ca['clientPartner']['partner'],ca['clientPartner'],newOrder);
                                //update the order no and status
                                await this.orderService.saveOrder({...newOrder, alertSecurityId: id, status:brokerOrderResponse.orderStatus, brokerOrderId:brokerOrderResponse.orderId});    
                            } catch (error) {
                                this.logger.log('error', error.response.data)   
                            }
                        }
                        else
                            await this.orderService.saveOrder({...newOrder,alertSecurityId: id,});
                    }
                    else {
                        this.logger.log('info', `Amount configured for new position is insufficient for ${order.symbol}`)
                    }
                }
            }
            else {
                if(order.transType == ca.alert.alertType){
                    await this.orderService.saveOrder(this.buildRepeatOrder(ca,alertInfo,secInfo,order));
                }
                else {
                    await this.orderService.saveOrder({...order, status: 'CLOSE', exitQty: order.entryQty, exitPrice: alertInfo['price']});
                }
                //if the alert type (BUY/SELL) is same as existing order, repeat (if configured)
                //otherwise, if configured to exit position by alert, close the position
            }
      });
    }

    isWithInConfiguredTimeWindow(duration: any) {
        const current = new Date();
        const start = new Date();
        start.setHours(duration['begin'].split(':')[0], duration['begin'].split(':')[1]);
        const end = new Date();
        end.setHours(duration['end'].split(':')[0], duration['end'].split(':')[1]);
        console.log('start: ',start);
        console.log('curent: ',current);
        console.log('end: ',end);
        
        // return current.getTime() >= start.getTime() && current.getTime() <= end.getTime() ;
        return true;
    }

    buildInitialOrder(ca: ClientAlert, alertInfo:any, secInfo: any): any {
        const order = {
            clientAlert: ca,
            exchSegment: ca['config']['exchange']+'_'+ca['config']['segment'],
            symbol: secInfo['underlying_symbol'],
            securityId: secInfo['security_id'], 
            transType: ca.alert.alertType,  
            status: 'OPEN'};

        const config = ca['config'];
        let qty = 0;
        const positionType = config['entry']['position']['type'];
        
        switch (positionType) {
            case 'UNIT':
                qty = config['entry']['position']['qty']['min'];
                break;
            case 'VALUE':
                const arrived = Math.round(+config['entry']['position']['qty']['min'] / +alertInfo['price']);
                if(arrived > 0 )
                    qty = arrived;
                break;
            default:
                break;
        }
        order['entryQty'] = qty;
        if(config['entry']['orderType'] == 'LIMIT'){
            order['entryPrice'] =  alertInfo['price'];
        }

        order['productType'] = config['entry']['productType'];
        order['orderType'] = config['entry']['orderType'];
       return order;
    }

    buildRepeatOrder(ca: ClientAlert, alertInfo:any, secInfo: any, order: any): any {
        const buildPositions = ca['config']['entry']['position']['build'];
        const productType = ca['config']['entry']['productType'];
        if(productType === 'CNC' && buildPositions && buildPositions == true){
            const orderTransType = order['transType'];        
            const alertTransType = alertInfo['alert']['alertType'];
            if(orderTransType !== alertTransType) { //averaging

            } else { //accumulating

            }
        }
        //TODO: for INTRADAY and MTF
        return order;
    }
}