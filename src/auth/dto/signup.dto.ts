import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class SignUpDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;
  

  @IsNotEmpty()
  @IsString()
  password!: string;

  @IsNotEmpty()
  @IsString()
  name!: string;
}
