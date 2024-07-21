import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  readonly userId: string;

  @IsNotEmpty()
  @IsString()
  readonly courseId: string;

  @IsNotEmpty()
  @IsString()
  readonly date: string;

  @IsNotEmpty()
  @IsString()
  readonly status: string;
}
