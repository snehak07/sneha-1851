import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from './brand.entity';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { RolesGuard } from '../common/guards/roles.guard';
import { User } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Brand, User])],
  controllers: [BrandController],
  providers: [BrandService, RolesGuard],
})
export class BrandModule {}
