import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateGoodDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  sale: string;

  @IsNotEmpty()
  @IsString()
  article: string;

  @IsNotEmpty()
  @IsString()
  brand: string;

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsNotEmpty()
  @IsString()
  price: string;

  @IsNotEmpty()
  @IsBoolean()
  availability: boolean;
}
