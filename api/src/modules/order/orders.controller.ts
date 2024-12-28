import { Body, Controller, Get, Inject, LoggerService, Post } from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { OrderService } from "./order.service";

@Controller('orders')
export class OrdersController {

    constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: LoggerService,
        private service: OrderService) { }

    @Post('/filter')
    async findAll(@Body() criteria: any) {
        return await this.service.findAll(criteria);
    }
}