import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CustomRequest } from '../../interfaces/custom-request/custom-request.interface';

@Injectable()
export class UserOwnsResourceGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: CustomRequest = context.switchToHttp().getRequest();
    const user = request.user;

    const userIdToAccess = request.params.userId;
    if (!userIdToAccess) {
      throw new BadRequestException('No User ID Provided');
    }

    if (user?.['id'] === userIdToAccess || user?.['sub'] === userIdToAccess) {
      return true;
    }
    throw new ForbiddenException('Access to this resource is forbidden');
  }
}
