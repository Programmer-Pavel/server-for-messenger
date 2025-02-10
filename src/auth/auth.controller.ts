import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';

import { ApiOkResponse } from '@nestjs/swagger';
import { SignInDto } from './dto/signin.dto';
import { Public } from './public.decorator';
import { SignInResponse } from './entities/signInResponse.entity';
import { SignUpDto } from './dto/signup.dto';
import { SignUpResponse } from './entities/signUpResponse.entity';
import { AuthService } from './services/auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  @ApiOkResponse({
    type: SignInResponse,
  })
  async signIn(@Body() signInDto: SignInDto, @Res({ passthrough: true }) response: Response) {
    return this.authService.signIn(signInDto, response);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('signup')
  @ApiOkResponse({
    type: SignUpResponse,
  })
  async signup(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Public()
  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    return this.authService.logout(response);
  }
}
