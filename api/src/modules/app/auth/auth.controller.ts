import { Body, Controller, Inject, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AppUser } from "src/entities/appuser.entity";

@Controller('auth')
export class AuthController {
  
    @Inject(AuthService)
    private readonly service: AuthService;
  
    @Post('login')
    private async login(@Body() body: any): Promise<AppUser | any> {
        try {
            return await this.service.login(body);    
        } catch (error) {
            return {error: error.message}
        }
    }  
}  