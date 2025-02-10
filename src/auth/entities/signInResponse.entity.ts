import { IsObject, IsString } from 'class-validator';

export class SignInResponse {
  @IsString()
  message!: string;

  @IsObject()
  user!: {
    id: number;
    email: string;
    name: string;
  };
}
