import { Inject, Injectable, LoggerService } from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";

@Injectable()
export class PlatformService {

    constructor (@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: LoggerService) {}

}