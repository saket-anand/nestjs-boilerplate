import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UnprocessableEntityException,
  UseGuards,
  Version,
} from '@nestjs/common';
import { GenerateOtpResponseDto } from './dtos/generate-otp-response.dto';
import { GenerateOtpRequestDto } from './dtos/generate-otp-request.dto';
import { AuthService } from './auth.service';
import { Otp } from '../otp/entities/otp.entity';
import { VerifyOtpDto } from './dtos/verify-otp.dto';
import { GenerateSessionResponseDto } from './dtos/generate-session-response.dto';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { ApiResponseDto } from '@common/dtos/api-response.dto';
import { LogoutResponseDto } from './dtos/logout-response.dto';
import { ResponseMessageConstants as Message } from '@common/constants/response-message.constants';
import { CustomRequest } from '@common/interfaces/custom-request/custom-request.interface';
import { AuthGuard } from '@common/guards/auth-guard/auth.guard';
import { User } from '../users/entities/user.entity';
import { BaseResponseDto } from '@common/dtos/base-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Version('1')
  @Post('/request-otp')
  @ApiResponse({ status: 200, type: ApiResponseDto(GenerateOtpResponseDto) })
  public async requestOtp(
    @Body() generateOtpRequestDto: GenerateOtpRequestDto,
  ): Promise<GenerateOtpResponseDto> {
    const otp: Otp = await this.authService.generateOtpForUser(
      generateOtpRequestDto,
    );
    return new GenerateOtpResponseDto(Message.OTP_SENT, otp);
  }

  @Version('1')
  @Post('/verify-otp')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: ApiResponseDto(GenerateSessionResponseDto) })
  public async verifyOtp(
    @Body() verifyOtpDto: VerifyOtpDto,
  ): Promise<GenerateSessionResponseDto> {
    const { userToken, options } = await this.authService.verifyOtpForUser(
      verifyOtpDto,
    );
    return new GenerateSessionResponseDto(
      Message.SESSION_GENERATED,
      userToken,
      options,
    );
  }

  @Version('1')
  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: ApiResponseDto(LogoutResponseDto) })
  public async logout(
    @Req() request: CustomRequest,
  ): Promise<LogoutResponseDto> {
    const result = await this.authService.logout(request.token);
    if (!result) {
      throw new UnauthorizedException(Message.INVALID_TOKEN);
    }
    return new LogoutResponseDto(Message.LOGGED_OUT);
  }

}
