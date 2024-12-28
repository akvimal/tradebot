import { Inject, Injectable, LoggerService } from "@nestjs/common";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { ClientOrder } from "src/entities/client-order.entity";
import { EntityManager, Repository } from "typeorm";

@Injectable()
export class OrderService {

    constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: LoggerService,
        @InjectEntityManager() private manager: EntityManager,
        @InjectRepository(ClientOrder) private readonly clientOrderRepository: Repository<ClientOrder>) {}

    async findOrder(clientId:number, exchange: string, segment:string, symbol: string, status: string) {
        return await this.clientOrderRepository.createQueryBuilder('co')
        .innerJoinAndMapOne('co.clientAlert', 'co.clientAlert', 'alert')
        .innerJoinAndMapOne('alert.clientPartner', 'alert.clientPartner', 'partner')
        .where(`partner.clientId = :clientId and alert.config->>'exchange' = :exchange and alert.config->>'segment' = :segment and co.symbol = :symbol and co.status = :status`, 
            {clientId,exchange,segment,symbol,status}).getOne();
    }

    async findAll(criteria:any){
        let sql = `
            select ca.config -> 'entry' -> 'productType' as product_type, client_alert_id, 
            broker_order_id, exch_segment, trans_type, co.created_on as order_dt, co.symbol, entry_qty, 
            entry_price, exit_qty, exit_price, status, als.created_on as trigger_dt
            from client_orders co 
            inner join client_alerts ca on ca.id = co.client_alert_id 
            inner join alerts a on a.id = ca.alert_id 
            inner join alert_securities als on als.id = co.alert_security_id
            where product_type = 'INTRADAY'
            order by co.created_on desc
        `
        return this.manager.query(sql);
    }

    async saveOrder(order:ClientOrder){
        console.log(order);
        
        return await this.clientOrderRepository.save(order);
    }

}