import { SoftDeletable } from '@app/common/interfaces/soft-deletable.interface';

export interface Timestamped extends SoftDeletable {
  id?: number;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}
