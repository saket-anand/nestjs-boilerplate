import { ExtendedBaseEntity } from '@app/common/entities/extended-base.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { UserStatusEnum } from '../enums/user-status.enum';
import { v4 as uuid } from 'uuid';
import { UserProfile } from '@app/modules/api/users/entities/user-profile.entity';

@Entity()
export class User extends ExtendedBaseEntity {
  @ApiProperty({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Column({ name: 'user_id' })
  @Index({
    unique: true,
  })
  userId: string;

  @ApiProperty({ description: 'User Name', example: '' })
  @Column({ name: 'username', nullable: true })
  username: string;

  @ApiProperty({
    description: 'User phone number (encrypted in POST)',
    example: '9999999999',
  })
  @Column({ name: 'phone_number', nullable: true })
  phoneNumber: string;

  @ApiProperty({
    description: 'If the mobile has been verified.',
    example: false,
  })
  @Column({ name: 'is_mobile_verified', default: false })
  isMobileVerified: boolean;

  @ApiProperty({
    description: 'User email address ',
    example: 'test@example.com',
  })
  @Column({ name: 'email', nullable: true })
  email: string;

  @ApiProperty({
    description: 'If User email address is verified',
    example: false,
  })
  @Column({ name: 'is_email_verified', default: false })
  isEmailVerified: boolean;

  @ApiProperty({
    description: 'User Status',
    enum: UserStatusEnum,
    enumName: 'UserStatusEnum',
  })
  @Column({
    name: 'user_status',
    type: 'enum',
    default: UserStatusEnum.ACTIVE,
    enum: UserStatusEnum,
  })
  status: UserStatusEnum;

  @Column('simple-json', { name: 'user_meta_data', nullable: true })
  userMetadata?: object;

  @OneToOne(() => UserProfile, (userProfile: UserProfile) => userProfile.user)
  userProfile: UserProfile;

  @BeforeInsert()
  createUid() {
    this.userId = uuid();
  }

  markMobileVerified() {
    this.isMobileVerified = true;
  }

  markEmailVerified() {
    this.isEmailVerified = true;
  }

  activate() {
    this.status = UserStatusEnum.ACTIVE;
  }

  deactivate() {
    this.status = UserStatusEnum.INACTIVE;
  }
}
