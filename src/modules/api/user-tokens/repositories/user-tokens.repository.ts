import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserToken } from '../entities/user-token.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserTokensRepository extends Repository<UserToken> {
  constructor(
    @InjectRepository(UserToken) userTokensRepository: Repository<UserToken>,
  ) {
    super(
      userTokensRepository.target,
      userTokensRepository.manager,
      userTokensRepository.queryRunner,
    );
  }
}
