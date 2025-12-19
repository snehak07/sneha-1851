import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from '../brands/brand.entity';
import { CreateBrandDto } from '../brands/dto/create-brand.dto';
import { UpdateBrandDto } from '../brands/dto/update-brand.dto';
import { User } from '../users/user.entity';
import { BrandResponseDto } from './dto/brand-response.dto';
import { UserRole } from '../users/role.enum';
import { BrandStatus } from './brand-status.enum';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private brandRepo: Repository<Brand>,
  ) {}

  async create(dto: CreateBrandDto, admin: User): Promise<BrandResponseDto>  {

  if (admin.role !== 'ADMIN') {
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
    createdAt: saved.createdAt,
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

  const updated = await this.brandRepo.findOne({
    where: { id },
    relations: ['createdBy'],
  });

  if (!updated) {
    throw new NotFoundException('Brand not found after update');
  }

  return {
    id: updated.id,
    name: updated.name,
    description: updated.description,
    logoUrl: updated.logoUrl,
    createdAt: updated.createdAt,
    createdBy: {
      id: updated.createdBy.id,
      email: updated.createdBy.email,
    },
  };
}


async updateStatus(id: number, status: BrandStatus) {
  const brand = await this.brandRepo.findOne({ where: { id } });

  if (!brand) {
    throw new BadRequestException('Brand not found');
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
}
