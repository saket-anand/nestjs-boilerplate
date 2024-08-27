import { BeforeInsert, Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { ExtendedBaseEntity } from '@common/entities/extended-base.entity';
import { User } from './user.entity';
import { v4 as uuid } from 'uuid';

@Entity()
export class UserProfile extends ExtendedBaseEntity {
  @Column({
    name: 'user_profile_id',
    nullable: false,
    type: 'uuid',
    unique: true,
  })
  userProfileId: string;

  @Column({
    name: 'first_name',
  })
  firstName: string;

  @Column({
    name: 'last_name',
  })
  lastName: string;

  @Column({
    name: 'avatar_url',
    nullable: true,
  })
  avatarUrl: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'userId' })
  user: User;

  @BeforeInsert()
  createUid() {
    this.userProfileId = uuid();
  }
}
