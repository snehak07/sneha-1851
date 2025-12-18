import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from '../brands/brand.entity';
import { CreateBrandDto } from '../brands/dto/create-brand.dto';
import { UpdateBrandDto } from '../brands/dto/update-brand.dto';
import { User } from '../users/user.entity';
import { BrandResponseDto } from './dto/brand-response.dto';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private brandRepo: Repository<Brand>,
  ) {}

  async create(dto: CreateBrandDto, admin: User): Promise<BrandResponseDto>  {
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
    await this.brandRepo.update(id, dto);

    const brand = await this.brandRepo.findOne({
    where: { id },
    relations: ['createdBy'],
  });

  if (!brand) {
    throw new BadRequestException('Brand not found');
  }

  return {
    id: brand.id,
    name: brand.name,
    description: brand.description,
    logoUrl: brand.logoUrl,
    createdAt: brand.createdAt,
    createdBy: {
      id: brand.createdBy.id,
      email: brand.createdBy.email,
    },
  };
}
    
  async delete(id: number) {
   const result = await this.brandRepo.delete(id);

  if (!result.affected) {
    throw new BadRequestException('Brand not found');
  }

  return { message: 'Brand deleted successfully' };
}
}
