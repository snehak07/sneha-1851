import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';
import { UserRole } from './role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async createUser(email: string, password: string, role: UserRole) {
    // 1️ Check existing user
    const existing = await this.userRepo.findOne({ where: { email } });
    if (existing) {
      throw new BadRequestException('User already exists');
    }

    // 2️ Hash password
    const hashed = await bcrypt.hash(password, 10);

    // 3️ Create entity
    const user = this.userRepo.create({
      email,
      password: hashed,
      role,
    });

    // 4️ SAVE TO DB (this was missing / failing earlier)
    const savedUser = await this.userRepo.save(user);

    return {
    message: `${savedUser.role} user created successfully`,
    user: {
    id: savedUser.id,
    email: savedUser.email,
    role: savedUser.role,
    },
    };
  }
}
