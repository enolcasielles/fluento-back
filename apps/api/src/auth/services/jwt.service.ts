import * as jwt from 'jsonwebtoken';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Role } from '@/core/enums/roles.enum';

const SECRET_KEY = process.env.SECRET_KEY;

@Injectable()
export class Jwt {
  generate(role: Role, userId: string) {
    return jwt.sign({ userId, role }, SECRET_KEY, {
      algorithm: 'HS256',
    });
  }
  parse(token: string) {
    try {
      return jwt.verify(token, SECRET_KEY);
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
