import { BaseResponseDto } from '@common/dtos/base-response.dto';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { Expose, Transform, Type } from 'class-transformer';

export class UserDetailsResponseDto extends BaseResponseDto {
  @IsString()
  @Expose()
  userId: string;

  @IsString()
  @Expose()
  @Transform(({ obj }) => obj.status)
  userStatus: string;

  @IsString()
  @Expose()
  phoneNumber: string;

  @IsString()
  @Expose()
  username: string;
}
