import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class TokenExtractionMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    if (!this.shouldSkipTokenExtraction(req)) {
      req.token = this.extractToken(req);
    }
    next();
  }

  private shouldSkipTokenExtraction(req: Request): boolean {
    // Define the logic to determine whether the route should be skipped
    const skipRoutes = [
      '/api/v1/auth/generate-otp',
      '/api/v1/auth/submit-otp',
    ];
    const skipRouteStartsWith = ['/link'];
    if (skipRoutes.includes(req.originalUrl)) {
      return true;
    }
    for (const prefix of skipRouteStartsWith) {
      if (req.originalUrl.startsWith(prefix)) {
        return true;
      }
    }
    return false;
  }

  private extractToken(req: Request): string | null {
    // Implement the logic to extract the token from the request headers or cookies
    const authorizationHeader = req.headers.authorization;
    // Typically, the Authorization header is in the format: 'Bearer TOKEN'
    if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
      return authorizationHeader.slice(7); // Extract the token string
    } else if (authorizationHeader) {
      return authorizationHeader;
    }
    return null;
  }
}
