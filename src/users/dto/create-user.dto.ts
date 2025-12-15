import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { UserRole } from '../role.enum';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(UserRole)
  role: UserRole; // ADMIN or BRAND
}
