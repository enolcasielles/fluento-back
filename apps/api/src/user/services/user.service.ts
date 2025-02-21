import { Injectable, Inject } from '@nestjs/common';
import { PrismaClient } from '@repo/database';
import { PRISMA_PROVIDER } from '@/core/modules/core.module';
import { GetUserResponse } from '../responses/get-user.response';
import { CustomException } from '@/core/exceptions/custom.exception';

@Injectable()
export class UserService {
  constructor(
    @Inject(PRISMA_PROVIDER) private prisma: PrismaClient,
  ) {}

  async getUser(userId: string): Promise<GetUserResponse> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!user) {
      throw new CustomException({
        message: 'Usuario no encontrado',
        statusCode: 404,
      });
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
} 