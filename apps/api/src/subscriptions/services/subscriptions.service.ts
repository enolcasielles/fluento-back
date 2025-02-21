import { Injectable, Inject } from '@nestjs/common';
import { PrismaClient } from '@repo/database';
import { PRISMA_PROVIDER } from '@/core/modules/core.module';
import { CustomException } from '@/core/exceptions/custom.exception';
import { GetSubscriptionStatusResponse } from '../responses/get-subscription-status.response';
import { BasicResponse } from '@/core/responses/basic.response';
import { addMonths } from 'date-fns';

@Injectable()
export class SubscriptionsService {
  constructor(
    @Inject(PRISMA_PROVIDER) private prisma: PrismaClient,
  ) {}

  async getStatus(userId: string): Promise<GetSubscriptionStatusResponse> {
    const subscription = await this.prisma.subscription.findFirst({
      where: {
        userId,
        status: 'active',
      },
    });

    if (!subscription) {
      return {
        isActive: false,
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
      };
    }

    return {
      isActive: true,
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
      currentPeriodEnd: subscription.currentPeriodEnd.toISOString(),
    };
  }

  async activate(userId: string): Promise<BasicResponse> {
    const subscription = await this.prisma.subscription.findFirst({
      where: {
        userId,
        status: 'active',
      },
    });

    if (subscription && !subscription.cancelAtPeriodEnd) {
      throw new CustomException({
        message: 'El usuario ya tiene una suscripción activa',
        statusCode: 400,
      });
    } else if (subscription && subscription.cancelAtPeriodEnd) {
      await this.prisma.subscription.update({
        where: {
          id: subscription.id,
        },
        data: {
          cancelAtPeriodEnd: false,
        },
      });
    } else {
      await this.prisma.subscription.create({
        data: {
          userId,
          status: 'active',
          currentPeriodEnd: addMonths(new Date(), 1),
          cancelAtPeriodEnd: false,
        },
      });
    }

    return {
      success: true,
    };
  }

  async cancel(userId: string): Promise<BasicResponse> {
    if (!userId) {
      throw new CustomException({
        message: 'Usuario no autenticado',
        type: 'AuthenticationError',
        statusCode: 401,
      });
    }

    const subscription = await this.prisma.subscription.findFirst({
      where: {
        userId,
        status: 'active',
      },
    });

    if (!subscription) {
      throw new CustomException({
        message: 'No se encontró una suscripción activa',
        type: 'NotFoundError',
        statusCode: 404,
      });
    }

    await this.prisma.subscription.update({
      where: {
        id: subscription.id,
      },
      data: {
        cancelAtPeriodEnd: true,
      },
    });

    return {
      success: true,
    };
  }
} 