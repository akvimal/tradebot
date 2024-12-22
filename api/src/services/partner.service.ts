import { Inject, Injectable, LoggerService } from "@nestjs/common";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Partner } from "src/entities/partner.entity";
import { EntityManager, Repository } from "typeorm";

@Injectable()
export class PartnerService {

    constructor (@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: LoggerService,
    @InjectEntityManager() private manager: EntityManager,
    @InjectRepository(Partner) private readonly businessRepository: Repository<Partner>) {}

    async save(partner: Partner) {
        return await this.manager.save(partner);
    }
}