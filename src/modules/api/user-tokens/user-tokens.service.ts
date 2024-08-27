import { Inject, Injectable } from '@nestjs/common';
import { UserTokensRepository } from './repositories/user-tokens.repository';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserToken } from './entities/user-token.entity';
import { User } from '../users/entities/user.entity';
import { MoreThan, UpdateResult } from 'typeorm';
import * as moment from 'moment';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Injectable()
export class UserTokensService {
  constructor(
    private readonly userTokensRepository: UserTokensRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  public async generateToken(payload): Promise<string> {
    return this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow('app.jwtAuthSecret'),
    });
  }

  public async saveTokenForUser(token: string, user: User): Promise<UserToken> {
    const userToken: UserToken = this.userTokensRepository.create({
      accessToken: token,
      user: user,
    });
    return this.userTokensRepository.save(userToken);
  }

  public async revokeToken(token: string): Promise<boolean> {
    await this.cacheManager.del(`user:token:${token}`);
    const result: UpdateResult = await this.userTokensRepository.update(
      {
        accessToken: token,
        isRevoked: false,
      },
      {
        isRevoked: true,
      },
    );
    if (result.affected > 0) {
      return true;
    }
    return null;
  }

  public async validateToken(token: string): Promise<User> {
    const userToken: UserToken = await this.userTokensRepository.findOne({
      where: {
        accessToken: token,
        isRevoked: false,
        expiresAt: MoreThan(moment().toDate()),
      },
      relations: ['user'], //If token is
    });
    if (!userToken) {
      return null;
    }
    // Calculate the difference in days between now and the token's expiration date
    const daysUntilExpiration = moment(userToken.expiresAt).diff(
      moment(),
      'days',
    );

    // Extend the expiration date by 1 day only if it's less than 5 days away
    if (daysUntilExpiration < 2) {
      userToken.expiresAt = moment(userToken.expiresAt).add(2, 'days').toDate();
      await userToken.save();
    }
    return userToken.user;
  }
}
