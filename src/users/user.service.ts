import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';
import { UserRole } from './role.enum';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async createUser(dto: CreateUserDto) {
    const { email, password, role, brandId } = dto;

    // 1️⃣ Check existing user
    const existing = await this.userRepo.findOne({ where: { email } });
    if (existing) {
      throw new BadRequestException('User already exists');
    }

    // 2️⃣ Business rules
    if (role === UserRole.BRAND && !brandId) {
      throw new BadRequestException('brandId is required for BRAND users');
    }

    if (role === UserRole.ADMIN && brandId) {
      throw new BadRequestException('Admin cannot have brandId');
    }

    // 3️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️⃣ Create user entity
    const user = this.userRepo.create({
      email,
      password: hashedPassword,
      role,
      brandId: role === UserRole.BRAND ? brandId : null,
    });

    // 5️⃣ Save user
    const savedUser = await this.userRepo.save(user);

    return {
      message: `${savedUser.role} user created successfully`,
      user: {
        id: savedUser.id,
        email: savedUser.email,
        role: savedUser.role,
        brandId: savedUser.brandId,
      },
    };
  }
}
