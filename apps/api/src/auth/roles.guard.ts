import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Jwt } from './services/jwt.service';
import { Role } from '@/core/enums/roles.enum';
import { ROLE_KEY } from './roles.decorator';
import { UnauthorizedException } from '@/core/exceptions/unauthorized.exception';
import prisma from '@repo/database';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private jwt: Jwt) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const validRoles = this.reflector.getAllAndOverride<Array<Role>>(ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!validRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    const token = authHeader?.split(" ")[1];
    const payload = this.jwt.decodeToken(token) as any;
    if (payload.exp < Date.now() / 1000) {
      throw new UnauthorizedException("Token expirado.");
    }

    const user = await prisma.user.findUnique({
      where: {
        sub: payload.sub,
      },
    });

    console.log(user);

    const isValid = validRoles.some((r) => r === user?.role as Role);

    if (!user || !isValid) {
      throw new UnauthorizedException("No tienes permiso para acceder a este recurso.", "UNAUTHORIZED");
    }
    request.headers['user-id'] = user.id;
    return true;
  }
}
