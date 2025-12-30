import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';
import { UserRole } from './role.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly mailService: MailService,
  ) {}

  async createUser(dto: CreateUserDto) {
    const { email, password, role, brandId } = dto;

    // 1️ Check existing user
    const existing = await this.userRepo.findOne({ where: { email } });
    if (existing) {
      throw new BadRequestException('User already exists');
    }

    // 2️ Business rules
    if (role === UserRole.BRAND && !brandId) {
      throw new BadRequestException('brandId is required for BRAND users');
    }

    if (role === UserRole.ADMIN && brandId) {
      throw new BadRequestException('Admin cannot have brandId');
    }

    const plainPassword = password; 
    // 3️ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️ Create user entity
    const user = this.userRepo.create({
      email,
      password: hashedPassword,
      role,
      brandId: role === UserRole.BRAND ? brandId : null,
    });

    // 5️ Save user
    const savedUser = await this.userRepo.save(user);

  //  Send email only for BRAND users
  if (savedUser.role === UserRole.BRAND) {
   await this.mailService.sendBrandCredentials(email, plainPassword);
   } 

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

  async updateProfile(userId: number, dto: UpdateProfileDto) {
  const user = await this.userRepo.findOne({ where: { id: userId } });
  if (!user) throw new NotFoundException('User not found');

  if (dto.password) {
    dto.password = await bcrypt.hash(dto.password, 10);
  }

  Object.assign(user, dto);
  const updated = await this.userRepo.save(user);

  return {
    message: 'Profile updated successfully',
    user: {
      id: updated.id,
      email: updated.email,
      }
    }  
  }
}