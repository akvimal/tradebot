import { Inject, Injectable, LoggerService } from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import * as moment from 'moment-timezone';

import { AlertService } from "../alert/alert.service";
import { OrderService } from "../order/order.service";
import { BrokerFactoryService } from "../broker/broker-factory.service";

import { ClientAlert } from "src/entities/client-alert.entity";
import { all } from "axios";
import { DataService } from "../master/data.service";

@Injectable()
export class AlertProcessor {
    
    constructor (@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: LoggerService,
        private readonly alertService:AlertService, 
        private readonly orderService:OrderService, 
        private readonly dataService:DataService, 
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
            // const secInfo = (await this.alertService.findSecurityMaster(ca['config']['exchange'], ca['config']['segment'], alertInfo.symbol))[0];
            //get client order, if not exist create one
            //get the instrument type (equity, future, option)
            const exchSegment = ca['config']['exchange']+'_'+ca['config']['segment'];
            const expiry = '2025-01-30';//TODO: get the expiry date from the API
            //call api to get the expiry dates if the segment is OPT
            if(ca['config']['instrument'] === 'OPTSTK'){ 
                const secInfo = (await this.dataService.getOptionSecurityId(ca['config']['exchange'],
                    ca['config']['segment'], alertInfo['symbol'], expiry, alertInfo['price'], ca['config']['optionType']))[0];
                const secId = secInfo['security_id'];
                const qtyPerLot = secInfo['lot_size'];
                console.log(`secId: ${secId}, qtyPerLot: ${qtyPerLot}`);
                
                 if(ca.isLive){
                            //call the appropriate broker service with new order
                            const brokerService = this.brokerFactoryService.getBroker(ca['clientPartner']['partner']['name']);
                            try {
                                const brokerOrderResponse = await brokerService.placeOrder(ca['clientPartner']['partner'],ca['clientPartner'],{
                                    transType: ca['config']['position'],
                                    exchSegment, 
                                    productType: ca['config']['entry']['productType'], 
                                    orderType: ca['config']['entry']['orderType'],
                                    securityId: secId,
                                    entryQty: qtyPerLot
                                });
                                //update the order no and status
                                console.log(brokerOrderResponse);
                                this.orderService.saveOrder({clientAlertId: ca['id'], 
                                    alertSecurityId: id,exchSegment: exchSegment, 
                                    securityId: secId, symbol: alertInfo['symbol'],transType: ca['config']['position'],entryQty: qtyPerLot,
                                    productType: ca['config']['entry']['productType'], orderType: ca['config']['entry']['orderType'],
                                    brokerOrderId: brokerOrderResponse['orderId'],status: brokerOrderResponse['orderStatus']});
                                
                            } catch (error) {
                                console.log('>>>>>>',error.response.data);
                                this.orderService.saveOrder({clientAlertId: ca['id'], 
                                    alertSecurityId: id,exchSegment: exchSegment, 
                                    securityId: secId, symbol: alertInfo['symbol'],transType: ca['config']['position'],entryQty: qtyPerLot,
                                    productType: ca['config']['entry']['productType'], orderType: ca['config']['entry']['orderType'],status: 'ERROR',comments: `${error.response.data['errorCode']}:${error.response.data['errorMessage']}`});
                                this.logger.log('error', error.response.data)   
                            }
                        }
            }
            

           
      });
    }

    isTimeWithinWindow(inputTime, timeRange) {
        const startTime = timeRange['begin'];
        const endTime = timeRange['end'];
        // Parse the input times
        const [inputHours, inputMinutes] = inputTime.split(':').map(Number);
        const [startHours, startMinutes] = startTime.split(':').map(Number);
        const [endHours, endMinutes] = endTime.split(':').map(Number);
    
        // Convert the times into minutes since midnight for comparison
        const inputTotalMinutes = inputHours * 60 + inputMinutes;
        const startTotalMinutes = startHours * 60 + startMinutes;
        const endTotalMinutes = endHours * 60 + endMinutes;
    
        // Check if the input time is within the window
        return inputTotalMinutes >= startTotalMinutes && inputTotalMinutes <= endTotalMinutes;
    }

    buildEntryOrder(ca: ClientAlert, alertInfo:any, secInfo: any): any {
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
        console.log('building repeat order ...');
        
        const buildPositions = ca['config']['entry']['position']['build'];
        const productType = ca['config']['entry']['productType'];
        if(productType === 'CNC' && buildPositions && buildPositions == true){
            const orderTransType = order['transType'];        
            const alertTransType = alertInfo['alert']['alertType'];
            if(orderTransType !== alertTransType) { //averaging
                console.log('averaging...');
                                    
            } else { //accumulating
                console.log('accumulating...');
                order['qty']
            }
        }
        //TODO: for INTRADAY and MTF
        return order;
    }
}