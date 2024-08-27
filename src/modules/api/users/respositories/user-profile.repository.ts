import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserProfile } from '@api/users/entities/user-profile.entity';

@Injectable()
export class UserProfileRepository extends Repository<UserProfile> {
  constructor(
    @InjectRepository(UserProfile)
    private userProfileRepository: Repository<UserProfile>,
  ) {
    super(
      userProfileRepository.target,
      userProfileRepository.manager,
      userProfileRepository.queryRunner,
    );
  }

  async findByUserId(userId: string): Promise<UserProfile> {
    return this.userProfileRepository.findOne({
      where: {
        user: {
          userId: userId,
        },
      },
    });
  }
}
