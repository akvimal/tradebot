import { Inject, Injectable, LoggerService } from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";

import { AlertService } from "../alert/alert.service";
import { OrderService } from "../order/order.service";
import { BrokerFactoryService } from "../broker/broker-factory.service";

import { ClientAlert } from "src/entities/client-alert.entity";
import { Order } from "../shared/order.model";

@Injectable()
export class AlertProcessor {
    
    constructor (@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: LoggerService,
        private readonly alertService:AlertService, 
        private readonly orderService:OrderService, 
        private readonly brokerFactoryService:BrokerFactoryService){}

    async processAlert(id: number) {
        this.logger.log('info',`Processing alert entry for ${id}`);
        const alertSecInfo = await this.alertService.findAlertSecurity(id);
        this.logger.log('info',`Alert Security Info: ${JSON.stringify(alertSecInfo)}`);
        //get client alerts for the partner and alert
        const clientAlerts = await this.alertService.findClientAlerts(alertSecInfo['alert']['id']);
        
        //get the security id for the symbol
        const secInfo = await this.alertService.findSecurityMaster(alertSecInfo.alert.exchange, alertSecInfo.alert.instrument, alertSecInfo.symbol);
        // console.log(secInfo);
        // {
        //   security_id: '3220',
        //   underlying_symbol: 'LODHA',
        //   display_name: 'Macrotech Developers'
        // }
        clientAlerts.forEach(async (ca) => {
            //get client order, if not exist create one
            

            const orderObj = this.buildOrder(ca, secInfo);
            // this.orderService.placeOrder(orderObj);

            if(!ca.isVirtual) {
                const brokerService = this.brokerFactoryService.getBroker(ca.clientPartner.partner.name);
                const orderRequest = brokerService.getOrderRequest(orderObj);
                
                this.logger.log('info', `processing ${ca.clientPartner.accountId}`);
            
            }
      });

    }

    buildOrder(ca: ClientAlert, secInfo: any): Order {
        throw new Error("Method not implemented.");
    }
}