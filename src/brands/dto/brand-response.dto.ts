export class BrandCreatorDto {
  id: number;
  email: string;
}

export class BrandResponseDto {
  id: number;
  name: string;
  description?: string;
  logoUrl?: string;
  createdBy?: BrandCreatorDto;
}
