import { CanLoginGuard } from './can-login.guard';

describe('CanLoginGuard', () => {
  it('should be defined', () => {
    expect(new CanLoginGuard()).toBeDefined();
  });
});
