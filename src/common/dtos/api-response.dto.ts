import { ApiProperty } from '@nestjs/swagger';
import { Type } from '@nestjs/common';

export function ApiResponseDto<TData>(data: Type<TData>) {
  class ApiResponseDtoClass {
    @ApiProperty({ example: true })
    success: boolean;

    @ApiProperty({ example: 'Successful' })
    message: string;

    @ApiProperty({ example: 1001 })
    code: number;

    @ApiProperty({ example: 200 })
    statusCode: number;

    @ApiProperty({ type: () => data })
    data: TData;
  }

  return ApiResponseDtoClass;
}

// export function ApiResponseDto<TData>(data: TData) {
//   class ApiResponseDtoClass {
//     @ApiProperty({ example: true })
//     success: boolean;
//
//     @ApiProperty({ example: 'Successful' })
//     message: string;
//
//     @ApiProperty({ example: 1001 })
//     code: number;
//
//     @ApiProperty({ example: 200 })
//     statusCode: number;
//
//     @ApiProperty({ type: () => data })
//     data: TData;
//   }
//
//   return ApiResponseDtoClass;
// }
