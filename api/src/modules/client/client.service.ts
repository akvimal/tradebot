import { Inject, Injectable, LoggerService } from "@nestjs/common";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { ClientOrder } from "src/entities/client-order.entity";
import { EntityManager, Repository } from "typeorm";

@Injectable()
export class ClientService {

    constructor (@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: LoggerService,
    @InjectEntityManager() private manager: EntityManager, 
    @InjectRepository(ClientOrder) private readonly clientOrderRepository: Repository<ClientOrder>) {}

    async getClientOrderId(clientAlertId: number) {  
      const clientPartnerOrder = this.findClientOrder(clientAlertId);
      if(clientPartnerOrder['id']) {
        // return clientPartnerOrder.id;
      }
      
    }

    async saveClientOrder(clientAlertId: number) {
      await this.clientOrderRepository.save({clientAlertId: clientAlertId});
    }

    async findClientOrder(clientAlertId: number) {
      const rec = await this.manager.query(`SELECT id FROM client_orders where client_alert_id = ${clientAlertId}`);
      return rec[0];
    }
}