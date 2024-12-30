import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthHelper } from './auth.helper';
import { AppUser } from 'src/entities/app-user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

  @Inject(AuthHelper)
  private readonly helper: AuthHelper;

  constructor(@Inject(ConfigService) config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_KEY'),
      ignoreExpiration: false,
    });
  }
  //callback function to populate the user into request of successful user validation
  private validate(payload: string): Promise<AppUser | never> {
    return this.helper.validateUser(payload);
  }

}