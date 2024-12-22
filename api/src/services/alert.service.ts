import { Inject, Injectable, LoggerService } from "@nestjs/common";
import { InjectEntityManager } from "@nestjs/typeorm";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { AlertSecurity } from "src/entities/alert-security.entity";
import { Alert } from "src/entities/alert.entity";
import { EntityManager } from "typeorm";

@Injectable()
export class AlertService {

    constructor (@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: LoggerService,
    @InjectEntityManager() private manager: EntityManager) {}

    async createAlert(name: string, createdOn: string, securities: any) {
        securities.forEach(async (security: any) => {
            await this.manager.query(
                `insert into alert_securities (alert_id, symbol,price,created_on) values 
                    ((select id from alerts where name = '${name}'), '${security['symbol']}', ${security['price']}, '${createdOn}');`);
            });
    }

}