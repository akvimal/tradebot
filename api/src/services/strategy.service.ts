import { Inject, Injectable, LoggerService } from "@nestjs/common";
import { InjectEntityManager } from "@nestjs/typeorm";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { EntityManager } from "typeorm";

@Injectable()
export class StrategyService {

    constructor (@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: LoggerService,
    @InjectEntityManager() private manager: EntityManager) {}

    findStrategies(alertId: string) {
        this.logger.log('info',`Finding strategies for alert ${alertId}`);
    }

    processStrategies(strategies: any) {
        //loop through the strategies
        //get clients subscribed to the strategy
        //build the payload for the client appropriate to the broker
        //send the payload to the broker
        //log the response (response will be processed by postback from the broker)
        this.logger.log('info',`Processing strategies`);
    }


}