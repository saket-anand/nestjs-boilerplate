import {
  BaseEntity,
  CreateDateColumn,
  DeleteDateColumn,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Timestamped } from '@app/common/interfaces/timestamped.interface';
import { Exclude } from 'class-transformer';

export abstract class ExtendedBaseEntity
  extends BaseEntity
  implements Timestamped
{
  @PrimaryGeneratedColumn()
  @Exclude()
  id: number;

  @CreateDateColumn({ name: 'created_at' })
  @Index()
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
