import { Request } from 'express';
import { User } from '../../../modules/api/users/entities/user.entity';

export interface CustomRequest extends Request {
  token?: string;
  user?: User;
}
