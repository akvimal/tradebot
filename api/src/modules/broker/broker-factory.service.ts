import { Injectable } from "@nestjs/common";
import { BrokerService } from "./broker.service";
import { DhanBrokerService } from "./dhan.service";

@Injectable()
export class BrokerFactoryService {

    constructor(private readonly dhanBrokerService: DhanBrokerService) {}

    getBroker(type: string): BrokerService {
        switch (type) {
            case 'dhan':
              return this.dhanBrokerService;
            default:
              throw new Error('Invalid broker type');
          }
    }
}