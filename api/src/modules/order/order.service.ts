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

    async saveOrder(order:ClientOrder){
        return await this.clientOrderRepository.save(order);
    }

}