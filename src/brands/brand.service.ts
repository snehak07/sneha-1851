import { Injectable, UnauthorizedException, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from '../brands/brand.entity';
import { CreateBrandDto } from '../brands/dto/create-brand.dto';
import { UpdateBrandDto } from '../brands/dto/update-brand.dto';
import { User } from '../users/user.entity';
import { BrandResponseDto } from './dto/brand-response.dto';
import { UserRole } from '../users/role.enum';
import { BrandStatus } from './brand-status.enum';
import { UpdateBrandProfileDto } from './dto/update-brand-profile.dto';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private brandRepo: Repository<Brand>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    
  ) {}

  async create(dto: CreateBrandDto, adminId: number,): Promise<BrandResponseDto>  {

    const admin = await this.userRepo.findOne({
    where: { id: adminId },
  });
  
  if (!admin) {
    throw new UnauthorizedException('Admin user not found');
  }

  // 2️ Role validation
  if (admin.role !== UserRole.ADMIN) {
    throw new UnauthorizedException('Only admins can create brands');
  }

  const existing = await this.brandRepo.findOne({
    where: { name: dto.name },
  });

  if (existing) {
    throw new BadRequestException('Brand already exists');
  }

    const brand = this.brandRepo.create({
      ...dto,
      createdBy: admin,
    });
    const saved = await this.brandRepo.save(brand);

  return {
    id: saved.id,
    name: saved.name,
    description: saved.description,
    logoUrl: saved.logoUrl,
    createdBy: {
      id: admin.id,
      email: admin.email,
    },
  };
  }

  async findAll(): Promise<BrandResponseDto[]> {
  const brands = await this.brandRepo.find({
    relations: ['createdBy'],
  });

  return brands.map((brand) => ({
    id: brand.id,
    name: brand.name,
    description: brand.description,
    logoUrl: brand.logoUrl,
    createdAt: brand.createdAt,
    createdBy: {
      id: brand.createdBy.id,
      email: brand.createdBy.email,
    },
  }));
}

  async update(id: number, dto: UpdateBrandDto): Promise<BrandResponseDto> {
    const brand = await this.brandRepo.preload({
    id,
    ...dto,
  });

  if (!brand) {
    throw new NotFoundException('Brand not found');
  }

  const saved = await this.brandRepo.save(brand);

return {
  id: saved.id,
  name: saved.name,
  description: saved.description,
  logoUrl: saved.logoUrl,
};
}


async updateStatus(id: number, status: BrandStatus) {
  const brand = await this.brandRepo.findOne({ where: { id } });

  if (!brand) {
    throw new NotFoundException('Brand not found');
  }

  brand.status = status;
  await this.brandRepo.save(brand);

  return {
    message: 'Brand status updated',
    id: brand.id,
    status: brand.status,
  };
}

    
  async delete(id: number, admin: User) {

    if (admin.role !== UserRole.ADMIN) {
    throw new UnauthorizedException('Only admins can delete brands');
  }

   const result = await this.brandRepo.delete(id);

  if (!result.affected) {
    throw new NotFoundException('Brand not found');
  }

  return { message: 'Brand deleted successfully' };
}

async updateOwnBrand(jwtUser: { id: number; role: UserRole },dto: UpdateBrandProfileDto) {

 if (jwtUser.role !== UserRole.BRAND) {
    throw new UnauthorizedException('Only brand users can update brand profile');
  }

  if (!Object.keys(dto).length) {
    throw new BadRequestException('No fields provided to update');
  }

  const user = await this.userRepo.findOne({
    where: { id: jwtUser.id },
  });

   if (!user || !user.brandId) {
    throw new ForbiddenException('Brand not assigned to this user');
  }

  const brand = await this.brandRepo.findOne({
    where: { id: user.brandId },
  });

  if (!brand) throw new NotFoundException('Brand not found');

  Object.assign(brand, dto);
  await this.brandRepo.save(brand);

return {
  message : 'Brand profile updated successfully',
  }
 }
}