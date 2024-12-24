import { Inject, Injectable, LoggerService } from "@nestjs/common";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { EntityManager, Repository } from "typeorm";

@Injectable()
export class OrderService {

    constructor (@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: LoggerService,
    @InjectEntityManager() private manager: EntityManager) {}

   
}