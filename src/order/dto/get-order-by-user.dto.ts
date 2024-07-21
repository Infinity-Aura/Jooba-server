import { IsNotEmpty, IsString } from 'class-validator';

export class GetOrderByUserDto {
  @IsNotEmpty()
  @IsString()
  readonly userId: string;

  @IsNotEmpty()
  @IsString()
  readonly courseId: string;
}
