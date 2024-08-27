import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  Version,
} from '@nestjs/common';
import { AuthGuard } from '@common/guards/auth-guard/auth.guard';
import { CustomRequest } from '@common/interfaces/custom-request/custom-request.interface';
import { plainToClass } from 'class-transformer';
import { UserDetailsResponseDto } from './dtos/user-details-response.dto';
import { SharedService } from '../shared/shared.service';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { UserOwnsResourceGuard } from '@common/guards/user-owns-resource/user-owns-resource.guard';
import { UpdateUserProfileDto } from '@api/users/dtos/update-user-profie.dto';
import { CheckUsernameRequestDto } from '@api/users/dtos/check-username-request.dto';
import { UpdateUsernameRequestDto } from '@api/users/dtos/update-username-request.dto';
import { User } from '@api/users/entities/user.entity';

@Controller('users')
@ApiBearerAuth()
export class UsersController {
  constructor(
    private readonly sharedService: SharedService,
    private readonly usersService: UsersService,
  ) {}

  @Get('me')
  @Version('1')
  @UseGuards(AuthGuard)
  async getMyDetails(@Req() req: CustomRequest) {
    return await this.usersService.fetchUserDetails(req.user.userId);
  }

  @Get('me/basic')
  @Version('1')
  @UseGuards(AuthGuard)
  // @UseInterceptors(CacheInterceptor)
  async getMyBasicDetails(@Req() req: CustomRequest) {
    return await this.usersService.fetchUserBasicDetails(req.user.userId);
  }

  @Post('/check-username-availability')
  @Version('1')
  @UseGuards(AuthGuard)
  async checkAvailableUsername(
    @Body() checkUsernameRequestDto: CheckUsernameRequestDto,
    @Req() req: CustomRequest,
  ) {
    const isAvailable = await this.usersService.checkUsernameAvailability(
      checkUsernameRequestDto,
    );
    return { isAvailable };
  }

  @ApiParam({
    name: 'userId',
    description: 'User Id',
    type: 'string',
    required: true,
  })
  @Post('/:userId/update-username')
  @Version('1')
  @UseGuards(AuthGuard, UserOwnsResourceGuard)
  async updateUsername(
    @Body() updateUsernameRequestDto: UpdateUsernameRequestDto,
    @Req() req: CustomRequest,
  ): Promise<User> {
    return await this.usersService.updateUsername(
      req.user.userId,
      updateUsernameRequestDto,
    );
  }

  @Get('/:userId/profile')
  @Version('1')
  @UseGuards(AuthGuard, UserOwnsResourceGuard)
  async getUserProfile(@Req() req: CustomRequest) {
    return await this.usersService.findUserProfile(req.user.userId);
  }

  @ApiParam({
    name: 'userId',
    description: 'User Id',
    type: 'string',
    required: true,
  })
  @Post('/:userId/profile')
  @Version('1')
  @UseGuards(AuthGuard, UserOwnsResourceGuard)
  async updateUserProfile(
    @Body() updateUserProfileDto: UpdateUserProfileDto,
    @Param('userId') userId: string,
    @Req() req: CustomRequest,
  ) {
    return await this.usersService.updateUserProfile(
      userId,
      updateUserProfileDto,
    );
  }

  @Get('/username/:username')
  @Version('1')
  async getUserPublicDetailsByUsername(@Param('username') username: string) {
    return this.usersService.findByUsername(username);
  }

  @ApiParam({
    name: 'userId',
    description: 'User Id',
    type: 'string',
    required: true,
  })
  @Get('/:userId')
  @Version('1')
  @UseGuards(AuthGuard, UserOwnsResourceGuard)
  async getUserDetails(@Req() req: CustomRequest) {
    return plainToClass(
      UserDetailsResponseDto,
      {
        ...req.user,
        message: 'Successful',
      },
      { excludeExtraneousValues: true },
    );
  }

  @ApiParam({
    name: 'userId',
    description: 'User Id',
    type: 'string',
    required: true,
  })
  @Post('/:userId')
  @Version('1')
  @UseGuards(AuthGuard, UserOwnsResourceGuard)
  async editUser(@Req() req: CustomRequest) {
    return 'In Progress';
  }
}
