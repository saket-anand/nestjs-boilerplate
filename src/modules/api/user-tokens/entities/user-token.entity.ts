import { Entity, Column, ManyToOne, BeforeInsert, JoinColumn, Index } from 'typeorm';
import { v4 as uuid } from 'uuid';
import * as moment from 'moment/moment';
import { Exclude } from 'class-transformer';
import { ExtendedBaseEntity } from '@app/common/entities/extended-base.entity';
import { TOKEN_VALIDITY_DURATION } from '@app/common/constants/app.constants';
import { User } from '../../users/entities/user.entity';

@Entity('user_tokens')
export class UserToken extends ExtendedBaseEntity {
  @Column({ name: 'token_id', unique: true })
  @Exclude()
  tokenId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'userId' })
  user: User;

  @Column({ name: 'access_token' })
  @Index({ unique: true })
  accessToken: string;

  @Column({ name: 'expires_at' })
  @Exclude()
  expiresAt: Date;

  @Column({ name: 'is_revoked', default: false, type: 'boolean' })
  @Exclude()
  isRevoked: boolean;

  @Column('simple-json', { name: 'token_meta_data', nullable: true })
  @Exclude()
  tokenMetadata?: string;

  @BeforeInsert()
  createUid(): void {
    this.tokenId = uuid();
  }

  @BeforeInsert()
  setTokenValidity(): void {
    this.expiresAt = moment().add(TOKEN_VALIDITY_DURATION, 'seconds').toDate();
  }
}
