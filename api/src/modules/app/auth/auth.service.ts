import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthHelper } from './auth.helper';
import { AppUser } from 'src/entities/appuser.entity';

@Injectable()
export class AuthService {

  @Inject(AuthHelper)
  private readonly helper: AuthHelper;

  constructor(@InjectRepository(AppUser) private readonly userRepository: Repository<AppUser>){}

  public async login(body: any): Promise<any | never> {
    const { email, password }: any = body;
    const user: AppUser = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new Error('Invalid Credentials');
    }

    const isPasswordValid: boolean = this.helper.isPasswordValid(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid Credentials');
    }

    this.userRepository.update(user.id, { lastlogin: new Date() });
    return {token: this.helper.generateToken(user)};
  }

  public async refresh(user: AppUser): Promise<string> {
    this.userRepository.update(user.id, { lastlogin: new Date() });
    return this.helper.generateToken(user);
  }
}