import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { UpdateBrandStatusDto } from './dto/update-brand-status.dto';
import { UserRole } from '../users/role.enum';
import { UpdateBrandProfileDto } from './dto/update-brand-profile.dto';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('brands')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post('admin')
  @Roles(UserRole.ADMIN)
  create(
    @Body() dto: CreateBrandDto,
    @Req() req,
  ) {
    return this.brandService.create(dto, req.user.id);
  }

  @Put('admin/:id/status')
  @Roles(UserRole.ADMIN)
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBrandStatusDto,
  ) {
    return this.brandService.updateStatus(id, dto.status);
  }

  @Get('admin')
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.brandService.findAll();
  }

  @Patch('admin/:id')
  @Roles(UserRole.ADMIN)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBrandDto,
  ) {
    return this.brandService.update(id, dto);
  }

  @Delete('admin/:id')
  @Roles(UserRole.ADMIN)
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
  ) {
    return this.brandService.delete(id, req.user);
  }

  @Patch('branduser/profile')
  @Roles(UserRole.BRAND)
  updateOwnBrand(
    @Req() req,
    @Body() dto: UpdateBrandProfileDto,
  ) {
    return this.brandService.updateOwnBrand(req.user, dto);
}
}
