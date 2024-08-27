import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserTokensService } from '@api/user-tokens/user-tokens.service';
import { ModuleRef } from '@nestjs/core';
import { InvalidTokenException } from '../../exceptions/invalid-token.exception';
import { User } from '@api/users/entities/user.entity';
import { Cache } from '@nestjs/cache-manager';

@Injectable()
export class AuthGuard implements CanActivate {
  private userTokenService: UserTokensService;
  private cacheManager: Cache;

  constructor(private readonly moduleRef: ModuleRef) {}

  async onModuleInit() {
    this.userTokenService = this.moduleRef.get(UserTokensService, {
      strict: false,
    });
    this.cacheManager = this.moduleRef.get(Cache, { strict: false });
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.token;
    if (!token) {
      throw new UnauthorizedException('No Token Found');
    }

    const cachedUser: User = await this.cacheManager.get<User>(
      `user:token:${token}`,
    );
    if (cachedUser) {
      request.user = cachedUser;
      return true;
    }

    try {
      const user: User = await this.userTokenService.validateToken(token);
      if (!user) {
        throw new InvalidTokenException();
      }
      // Cache the user object for subsequent requests with the same token
      await this.cacheManager.set(`user:token:${token}`, user); // Cache for 5 minutes, adjust TTL as needed

      // Attach user to request object
      request.user = user;
      return true;
    } catch (error) {
      if (error instanceof InvalidTokenException) {
        throw new InvalidTokenException();
      }
      // You could handle different types of errors differently
      // e.g., a TokenExpiredError could trigger a different response
      throw new UnauthorizedException('Invalid token', error.message);
    }
    // return true;
  }
}
