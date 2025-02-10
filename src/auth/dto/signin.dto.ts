import { Prisma } from '@prisma/client';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class SignInDto {
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  password!: string;
}
