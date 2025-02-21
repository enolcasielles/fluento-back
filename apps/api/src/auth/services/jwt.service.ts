import * as jwt from 'jsonwebtoken';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Role } from '@/core/enums/roles.enum';

const SECRET_KEY = process.env.SECRET_KEY;

interface TokenPayload {
  sub: string;
  exp: number;
}

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
  decodeToken(token: string) {
    return jwt.decode(token) as TokenPayload;
  }
}
