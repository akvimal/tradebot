import { Injectable } from "@nestjs/common";
import { InjectEntityManager } from "@nestjs/typeorm";
import { EntityManager } from "typeorm";

@Injectable()
export class BacktestService {

    constructor(@InjectEntityManager() private manager: EntityManager){}

    async saveAlert(alias,signals){
        await this.manager.query(`insert into bt_signals(alert_name,alert_signals) 
            values ('${alias}','${JSON.stringify(signals)}')`);
    }

    async findAlertById(id){
        return await this.manager.query(`select * from bt_signals where 
            id = ${id}`);
    }

    async findAll(){
        return await this.manager.query(`select id, alert_name, created_on from bt_signals order by created_on desc`);
    }

    async getSecurityIds(symbols){
        return await this.manager.query(`select underlying_symbol as symbol, security_id as id 
            from security_master where underlying_symbol in (${symbols})`);
    }
}