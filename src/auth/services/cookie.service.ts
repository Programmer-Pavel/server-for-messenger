import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { TOKEN_CONFIG } from 'src/config/tokens.config';

@Injectable()
export class CookieService {
  setTokens(response: Response, accessToken: string, refreshToken: string) {
    this.setAccessToken(response, accessToken);
    this.setRefreshToken(response, refreshToken);
  }

  setAccessToken(response: Response, token: string) {
    response.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: TOKEN_CONFIG.ACCESS_TOKEN.COOKIE_MAX_AGE,
    });
  }

  setRefreshToken(response: Response, token: string) {
    response.cookie('refresh_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: TOKEN_CONFIG.REFRESH_TOKEN.COOKIE_MAX_AGE,
    });
  }

  clearTokens(response: Response) {
    response.clearCookie('access_token');
    response.clearCookie('refresh_token');
  }
}
