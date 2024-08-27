import { ForbiddenException } from '@nestjs/common';

export class SignupException extends ForbiddenException {
  constructor() {
    super('Sign up is currently disabled.');
  }
}
