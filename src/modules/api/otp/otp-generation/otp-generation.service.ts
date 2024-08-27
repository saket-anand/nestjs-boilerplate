import { Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';

export class OtpGenerationService {
  static generateOtp(noOfChar: number, shouldBeAlphaNum = false): string {
    let characters = '';
    if (shouldBeAlphaNum) {
      characters =
        '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    } else {
      characters = '0123456789';
    }

    const charLength = characters.length;
    let otp = '';

    for (let i = 0; i < noOfChar; i++) {
      const randomIndex = Math.floor(Math.random() * charLength);
      otp += characters.charAt(randomIndex);
    }
    return otp;
  }

  static generateOtpUsingCrypto(
    noOfChar: number,
    shouldBeAlphaNum: boolean,
  ): string {
    let characters = '';
    if (shouldBeAlphaNum) {
      characters =
        '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    } else {
      characters = '0123456789';
    }

    const charLength = characters.length;
    let otp = '';

    const randomBytesCount = Math.ceil((noOfChar * Math.log2(charLength)) / 8);
    const maxValidByte = 256 - (256 % charLength);

    while (otp.length < noOfChar) {
      const randomBytesBuffer = randomBytes(randomBytesCount);
      for (
        let i = 0;
        i < randomBytesBuffer.length && otp.length < noOfChar;
        i++
      ) {
        const randomByte = randomBytesBuffer.readUInt8(i);
        if (randomByte < maxValidByte) {
          otp += characters.charAt(randomByte % charLength);
        }
      }
    }
    return otp;
  }
}

