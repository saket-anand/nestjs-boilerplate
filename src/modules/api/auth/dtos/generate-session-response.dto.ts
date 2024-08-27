import { BaseResponseDto } from '@common/dtos/base-response.dto';
import { UserToken } from '@api/user-tokens/entities/user-token.entity';
import { IsBoolean, IsDate, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateSessionResponseDto extends BaseResponseDto {
  @ApiProperty({
    description: 'access token to use',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI5YmM3ZGIxNS1jYjI5LTRhY2MtYmFlYi00OGFkMjljOTMxZTciLCJpYXQiOjE2OTkwOTQzOTZ9.7_jK2aFqQbhZwySp2SK45Eyngd2GXwuFWLGlxndUxlM',
  })
  @IsString()
  public accessToken: string;

  @ApiProperty({
    description: 'Token expiry date',
    example: '2023-11-05T15:34:33.027Z',
  })
  @IsDate()
  expiresAt: Date;

  @ApiProperty({
    description: 'Whether the user should complete onboarding',
    example: true,
  })
  @IsBoolean()
  shouldCompleteOnboarding?: boolean;

  constructor(message: string, userToken: UserToken, options?: any) {
    super(message);
    this.accessToken = userToken.accessToken;
    this.expiresAt = userToken.expiresAt;
    this.shouldCompleteOnboarding = options.shouldCompleteOnboarding;
  }
}
