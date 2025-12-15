import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { UserRole } from '../users/role.enum';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signup(dto: SignupDto) {
    const { email, password } = dto;

    const existingUser = await this.userRepo.findOne({
    where: { email },
    });

    if (existingUser) {
     throw new BadRequestException('Email already exists');
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = this.userRepo.create({
      email,
      password: hashed,
      role: UserRole.BRAND,
    });

    await this.userRepo.save(user);
    return { message: 'Signup successful' };
  }

  async login(dto: LoginDto) {
    const { email, password } = dto;
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
