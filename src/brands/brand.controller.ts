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
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { UpdateBrandStatusDto } from './dto/update-brand-status.dto';
import { UserRole } from '../users/role.enum';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('admin/brands')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post()
  create(
    @Body() dto: CreateBrandDto,
    @Req() req,
  ) {
    return this.brandService.create(dto, req.user);
  }

  @Put(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBrandStatusDto,
  ) {
    return this.brandService.updateStatus(id, dto.status);
  }

  @Get()
  findAll() {
    return this.brandService.findAll();
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBrandDto,
  ) {
    return this.brandService.update(id, dto);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
  ) {
    return this.brandService.delete(id, req.user);
  }
}
