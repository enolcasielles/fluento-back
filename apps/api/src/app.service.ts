import { Injectable } from '@nestjs/common';

export const API_VERSION = '1.0';

@Injectable()
export class AppService {
  getHello() {
    return {
      live: true,
      version: API_VERSION,
      env: process.env.MODE ?? null,
    };
  }
}
