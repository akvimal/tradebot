import { Inject, Injectable, LoggerService } from "@nestjs/common";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { AlertSecurity } from "src/entities/alert-security.entity";
import { Alert } from "src/entities/alert.entity";
import { ClientAlert } from "src/entities/client-alert.entity";
import { EntityManager, Repository } from "typeorm";

@Injectable()
export class AlertService {

    constructor (@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: LoggerService,
    @InjectEntityManager() private manager: EntityManager, 
    @InjectRepository(AlertSecurity) private readonly alertSecRepository: Repository<AlertSecurity>,
    @InjectRepository(ClientAlert) private readonly clientAlertRepository: Repository<ClientAlert>,
    @InjectRepository(Alert) private readonly alertRepository: Repository<Alert>) {}
    
    async findAllAlerts(criteria:any){
      return await this.alertRepository.createQueryBuilder('a')
      .innerJoinAndMapOne('a.partner', 'a.partner', 'partner').getMany();
    }

    async findAllAlertSecurities(alertId:number){
      return await this.alertSecRepository.find({where:{alertId},order:{createdOn:'desc'}});
    }

    async findAllClientAlerts(clients:[]){
      return await this.clientAlertRepository.createQueryBuilder('ca')
        .innerJoinAndMapOne('ca.alert', 'ca.alert', 'alert')
        .innerJoinAndMapOne('ca.clientPartner', 'ca.clientPartner', 'cp')
        .innerJoinAndMapOne('cp.client', 'cp.client', 'c')
        .select(['ca','alert'])
        .where('ca.isActive = true and c.id in (:...ids)', {ids:clients}).getMany();
    }

    async createAlertEntry( alertId: number, createdOn: string, symbol: string, price: number) {  
      const seq_id = (await this.manager.query(`select nextval('alert_securities_id_seq')`))[0].nextval;
      await this.manager.query(
        `insert into alert_securities (id, alert_id, symbol,price,created_on) values 
            (${seq_id},${alertId},'${symbol}',${price},'${createdOn}');`);
      return Promise.resolve(seq_id);
    }

    async findAlertSecurity(id: number) {
      return await this.alertSecRepository.createQueryBuilder('as')
      .innerJoinAndMapOne('as.alert', 'as.alert', 'alert')
      .innerJoinAndMapOne('alert.partner', 'alert.partner', 'partner')
      .select(['as','alert','partner'])
      .where('as.id = :id', {id}).getOne();
    }
    
    async findSecurityMaster(exchange: string, segment: string, symbol: string, ) {
      return await this.manager.query(
        `select security_id, underlying_symbol, display_name from security_master where exch_id = '${exchange}' 
        and series = '${segment}' and underlying_symbol = '${symbol}'`);
    }
    
    async findClientAlerts(alertId: number) {
      return await this.clientAlertRepository.createQueryBuilder('ca')
      .innerJoinAndMapOne('ca.alert', 'ca.alert', 'alert')
      .innerJoinAndMapOne('ca.clientPartner', 'ca.clientPartner', 'cp')
      .innerJoinAndMapOne('cp.client', 'cp.client', 'c')
      .innerJoinAndMapOne('cp.partner', 'cp.partner', 'p')
      .select(['ca','alert','cp','c','p'])
      .where('ca.alertId = :id', {id:alertId}).getMany();
    }

}