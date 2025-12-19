// dto/update-brand-status.dto.ts
import { IsEnum } from 'class-validator';
import { BrandStatus } from '../brand-status.enum';

export class UpdateBrandStatusDto {
  @IsEnum(BrandStatus)
  status: BrandStatus;
}
