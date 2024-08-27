import { BaseResponseDto } from '@common/dtos/base-response.dto';

export class LogoutResponseDto extends BaseResponseDto {
  constructor(message: string) {
    super(message);
  }
}
