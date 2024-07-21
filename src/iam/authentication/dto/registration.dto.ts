import { IsNotEmpty, IsEmail, IsString, MinLength } from 'class-validator';
import { Role } from 'src/user/enums/role.enum';

export class RegistrationDto {
  @IsNotEmpty()
  @IsString()
  readonly firstName: string;

  @IsNotEmpty()
  @IsString()
  readonly lastName: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter correct email' })
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  readonly password: string;

  @IsNotEmpty()
  @IsString()
  readonly role: string;
}
