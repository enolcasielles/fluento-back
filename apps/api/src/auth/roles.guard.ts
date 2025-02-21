import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Jwt } from './services/jwt.service';
import { Role } from '@/core/enums/roles.enum';
import { ROLE_KEY } from './roles.decorator';
import { UnauthorizedException } from '@/core/exceptions/unauthorized.exception';

interface Payload {
  userId: string;
  role: Role;
  exp: number;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private jwt: Jwt) {}

  canActivate(context: ExecutionContext): boolean {
    const validRoles = this.reflector.getAllAndOverride<Array<Role>>(ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!validRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['Authorization'];
    const token = authHeader?.split(" ")[1];
    const payload = this.jwt.parse(token) as Payload;
    if (payload.exp < Date.now() / 1000) {
      throw new UnauthorizedException("Token expirado.");
    }
    const isValid = validRoles.some((r) => r === payload.role);
    if (!isValid) {
      throw new UnauthorizedException("No tienes permiso para acceder a este recurso.", "UNAUTHORIZED");
    }
    request.headers['user-id'] = payload.userId.toString();
    return true;
  }
}
