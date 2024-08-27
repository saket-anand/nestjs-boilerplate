import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { UsersService } from '@api/users/users.service';
import { CustomRequest } from '../../interfaces/custom-request/custom-request.interface';
import { User } from '@api/users/entities/user.entity';

@Injectable()
export class UserOwnsResourceGuard implements CanActivate {
  constructor(
    private readonly usersService: UsersService, // Service to handle user operations
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: CustomRequest = context.switchToHttp().getRequest();
    const user: User = request.user; // User attached by AuthGuard

    // Assuming the user ID you want to check is in the path as 'userId'
    const userIdToAccess = request.params.userId;

    if (!userIdToAccess) {
      throw new BadRequestException('No User ID Provided');
    }

    // Here you could add logic to fetch additional data if needed
    // e.g., const userToAccess = await this.usersService.findById(userIdToAccess);

    // Check if the user making the request is the same as the user to be accessed or is an admin
    // || user.role === 'admin'
    if (user.userId === userIdToAccess) {
      return true;
    } else {
      throw new ForbiddenException('Access to this resource is forbidden');
    }
  }
}
