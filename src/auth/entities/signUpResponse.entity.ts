import { IsString, IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class SignUpResponse {
  @IsString()
  id!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsNotEmpty()
  @IsString()
  name!: string;
}
