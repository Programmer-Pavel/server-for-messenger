import { ApiProperty } from '@nestjs/swagger';

export class SignInResponseDto {
  @ApiProperty()
  message!: string;

  @ApiProperty({ example: { id: 1, email: 'test@mail.ru', name: 'User' } })
  user!: { id: number; email: string; name: string };
}
