import { Inject, Injectable, LoggerService } from "@nestjs/common";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { EntityManager, Repository } from "typeorm";
import * as moment from 'moment-timezone';

@Injectable()
export class DataService {

    constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: LoggerService,
        @InjectEntityManager() private manager: EntityManager) {}

    async getOptionSecurityId(exchange: string, segment:string, 
        symbol: string, expiry:string,
        strikePrice: number, optionType: string) {
        
        let sql = `
        select security_id, strike_price::numeric, lot_size 
        from security_master where underlying_symbol like '${symbol}-${moment(expiry).format('MMMYYYY')}%' 
        and exch_id = '${exchange}'
        and segment = '${segment}'
        and option_type = '${optionType}'
        and (strike_price::numeric - ${strikePrice}) ${optionType=='PE'?'>':'<'} 0
        order by strike_price ${optionType=='CE'?'desc':''} limit 1`
        return this.manager.query(sql);
    }


}