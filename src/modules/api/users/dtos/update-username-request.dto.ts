import { IsString, Length, Matches } from 'class-validator';

export class UpdateUsernameRequestDto {
  @IsString()
  @Length(3, 64)
  @Matches(/^[A-Za-z0-9]+(?:[_-]?[A-Za-z0-9]+)*$/, {
    message:
      'username should only contain alphabets, numbers, underscore and hyphens, must not end with hyphens',
  })
  username: string;

  constructor(username: string) {
    this.username = username;
  }
}
