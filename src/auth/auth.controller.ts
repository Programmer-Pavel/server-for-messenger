import { Body, Controller, Get, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';

import { ApiOkResponse } from '@nestjs/swagger';
import { SignInDto } from './dto/signin.dto';
import { Public } from './public.decorator';
import { SignUpDto } from './dto/signup.dto';
import { AuthService } from './services/auth.service';
import { Response } from 'express';
import { SignUpResponseDto } from './dto/sign-up-response.dto';
import { SignInResponseDto } from './dto/sign-in-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  @ApiOkResponse({
    type: SignInResponseDto,
  })
  async signIn(@Body() signInDto: SignInDto, @Res({ passthrough: true }) response: Response) {
    return this.authService.signIn(signInDto, response);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('signup')
  @ApiOkResponse({
    type: SignUpResponseDto,
  })
  async signup(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    return this.authService.logout(response);
  }

  @HttpCode(HttpStatus.OK)
  @Get('check-auth')
  async checkAuth() {}
}
