import { IsEmail, IsEnum, IsString, MinLength, IsOptional, IsNumber } from 'class-validator';
import { UserRole } from '../role.enum';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(UserRole)
  role: UserRole; // ADMIN or BRAND

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  brandId?: number;
}
