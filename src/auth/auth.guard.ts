import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './public.decorator';
import { AuthService } from './services/auth.service';
import { CookieService } from './services/cookie.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private cookieService: CookieService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const { access_token, refresh_token } = request.cookies;

    try {
      const payload = await this.authService.verifyAccessToken(access_token);

      request.user = payload;
      return true;
    } catch (error: any) {
      try {
        const refreshPayload = await this.authService.verifyRefreshToken(refresh_token);
        const accessToken = await this.authService.generateAccessToken(refreshPayload);

        this.cookieService.setAccessToken(response, accessToken);
        request.user = refreshPayload;
        return true;
      } catch (error: any) {
        return false;
      }
    }
  }
}
