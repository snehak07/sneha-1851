import { Controller, Post, Body, UseGuards, Req, Patch,  } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { UserRole } from './role.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './user.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('admin/create')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  createUser(@Body() dto: CreateUserDto) {
    return this.usersService.createUser(dto);
  }

  @Patch('me')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.BRAND)
  updateProfile(@Req() req, @Body() dto: UpdateProfileDto) {
  return this.usersService.updateProfile(req.user.id, dto);
}

}
