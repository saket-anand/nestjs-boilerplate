import {
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { Otp } from '../otp/entities/otp.entity';
import { GenerateOtpRequestDto } from './dtos/generate-otp-request.dto';
import { User } from '../users/entities/user.entity';
import { OtpService } from '../otp/otp.service';
import { UserStatusEnum } from '../users/enums/user-status.enum';
import { ExceptionTitleList } from '@common/constants/exception-title-list.constants';
import { VerifyOtpDto } from './dtos/verify-otp.dto';
import { UserTokensService } from '../user-tokens/user-tokens.service';
import { UserToken } from '../user-tokens/entities/user-token.entity';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { DataSource } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly otpService: OtpService,
    private readonly userTokensService: UserTokensService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly logger: Logger,
    private readonly dataSource: DataSource,
  ) {}

  public async generateOtpForUser(
    generateOtpRequestDto: GenerateOtpRequestDto,
  ): Promise<Otp> {
    const user: User = await this.usersService.findOrCreateUserByPhone(
      generateOtpRequestDto.phoneNumber,
    );
    if (user.status != UserStatusEnum.ACTIVE) {
      throw new ForbiddenException(ExceptionTitleList.Forbidden);
    }
    return await this.otpService.processOtpForUser(user);
  }

  public async verifyOtpForUser(
    verifyOtpDto: VerifyOtpDto,
  ): Promise<{ userToken: UserToken; options: any }> {
    const otpEntity: Otp = await this.otpService.verifyOtp(verifyOtpDto);
    if (!otpEntity) {
      throw new NotFoundException(
        'No valid Otp Id found for the given details',
      );
    }
    const user: User = await this.usersService.findOneByUserId(
      otpEntity.entityId,
    );
    if (!user) {
      throw new UnprocessableEntityException(
        'No valid User found for the given details',
      );
    }


    if (!user.isMobileVerified) {
      await this.usersService.markMobileAsVerified(user);
    }
    const options = { shouldCompleteOnboarding: false };
    const shouldCompleteOnboarding = await this.shouldCompleteOnboarding(user);
    if (shouldCompleteOnboarding) {
      options.shouldCompleteOnboarding = true;
    }
    const userToken: UserToken = await this.generateSession(user);
    return { userToken, options };
  }

  public async shouldCompleteOnboarding(user: User): Promise<boolean> {
    const userProfile = await this.usersService.findUserProfile(user.userId);
    return (
      !userProfile ||
      (userProfile && !userProfile.firstName && !userProfile.lastName)
    );
  }

  private async generateSession(user: User): Promise<UserToken> {
    const payload = { userId: user.userId };
    const token: string = await this.userTokensService.generateToken(payload);
    return await this.userTokensService.saveTokenForUser(token, user);
  }

  public async logout(token: string): Promise<boolean> {
    return this.userTokensService.revokeToken(token);
  }
}
