import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { UsersRepository } from './respositories/users.repository';
import { User } from './entities/user.entity';
import { SignupException } from '@common/exceptions/signup.exception';
import { ConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { UserDetailsResponseDto } from './dtos/user-details-response.dto';
import { UserProfileRepository } from '@api/users/respositories/user-profile.repository';
import { UserProfile } from '@api/users/entities/user-profile.entity';
import { UpdateUserProfileDto } from '@api/users/dtos/update-user-profie.dto';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { FileHandlerService } from '@core/file-handler/file-handler.service';
import { CheckUsernameRequestDto } from '@api/users/dtos/check-username-request.dto';
import { UpdateUsernameRequestDto } from '@api/users/dtos/update-username-request.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly userProfileRepository: UserProfileRepository,
    private readonly configService: ConfigService,
    private readonly fileHandlerService: FileHandlerService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  public async findOrCreateUserByPhone(phoneNumber: string): Promise<User> {
    let user: User = await this.findByPhoneNumber(phoneNumber);
    if (!user) {
      if (this.configService.getOrThrow('app.isSignupAllowed')) {
        user = await this.registerNewUserByPhoneNumber(phoneNumber);
      } else {
        throw new SignupException();
      }
    }
    return user;
  }

  private async findByPhoneNumber(phoneNumber: string): Promise<User> {
    return this.userRepository.findOne({
      where: {
        phoneNumber: phoneNumber,
      },
    });
  }

  private async registerNewUserByPhoneNumber(
    phoneNumber: string,
  ): Promise<User> {
    const user: User = new User();
    user.phoneNumber = phoneNumber;
    return this.userRepository.save(user);
    // this.userRepository.create();
  }

  public async findOneByUserId(userId: string): Promise<User> {
    return this.userRepository.findOne({
      where: {
        userId: userId,
      },
    });
  }

  public async findByUsername(username: string): Promise<User> {
    return this.userRepository.findOne({
      where: {
        username: username,
      },
      relations: ['userProfile'],
    });
  }

  public async checkUsernameAvailability(
    checkUsernameRequestDto: CheckUsernameRequestDto,
  ): Promise<boolean> {
    const reservedUsernames = this.configService.get('app.reservedUsernames');
    if (reservedUsernames.includes(checkUsernameRequestDto.username)) {
      return false;
    }
    const user = await this.userRepository.findOne({
      select: ['userId'],
      where: {
        username: checkUsernameRequestDto.username,
      },
    });
    if (user) {
      return false;
    }
    return true;
  }

  public async updateUsername(
    userId: string,
    updateUsernameRequestDto: UpdateUsernameRequestDto,
  ): Promise<User> {
    const user = await this.findOneByUserId(userId);
    if (!user) {
      throw new BadRequestException('User not found for the given userId');
    }
    const checkUsernameDto = new CheckUsernameRequestDto(
      updateUsernameRequestDto.username,
    );
    if (!(await this.checkUsernameAvailability(checkUsernameDto))) {
      throw new ConflictException(
        'Username is not available or taken by someone else',
      );
    }
    user.username = updateUsernameRequestDto.username;
    const savedUser: User = await this.saveUser(user);
    await this.updateUserDetailsCache(userId, savedUser);
    return savedUser;
  }

  public async findUserProfile(userId: string): Promise<UserProfile> {
    const userProfile: UserProfile =
      await this.userProfileRepository.findByUserId(userId);
    if (!userProfile) {
      return null;
    }
    return userProfile;
  }

  public async updateUserProfile(
    userId: string,
    dto: UpdateUserProfileDto,
  ): Promise<UserProfile> {
    let profile = await this.userProfileRepository.findByUserId(userId);
    if (!profile) {
      profile = new UserProfile();
      profile.user = { userId: userId } as User;
    }
    profile.firstName = dto.firstName;
    profile.lastName = dto.lastName;
    return this.userProfileRepository.save(profile);
  }


  public async markMobileAsVerified(user: User): Promise<User> {
    user.markMobileVerified();
    return this.saveUser(user);
  }

  public async fetchUserDetails(userId: string) {
    const user: User = await this.findOneByUserId(userId);

    return plainToInstance(
      UserDetailsResponseDto,
      {
        ...user,
        message: 'Successful',
      },
      { excludeExtraneousValues: true, enableImplicitConversion: true },
    );
  }

  public async fetchUserBasicDetails(userId: string) {
    let user = await this.cacheManager.get<User>(`user:${userId}`);
    if (!user) {
      user = await this.findOneByUserId(userId);
      await this.cacheManager.set(`user:${userId}`, user);
    }

    return plainToInstance(
      UserDetailsResponseDto,
      {
        ...user,
        message: 'Successful',
      },
      { excludeExtraneousValues: true },
    );
  }

  public async saveUser(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  public async fetchCachedUserDetails(userId: string): Promise<User[]> {
    return this.cacheManager.get(`user:${userId}`);
  }

  public async saveUserDetailsToCache(userId: string, userDetails: User) {
    return this.cacheManager.set(`user:${userId}`, userDetails);
  }

  public async updateUserDetailsCache(userId: string, userData?: User) {
    const user: User = userData || (await this.findOneByUserId(userId));
    return this.saveUserDetailsToCache(userId, user);
  }
}
