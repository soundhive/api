import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  static getHello(): { message: string } {
    return {
      message: 'Soundhive API',
    };
  }
}
