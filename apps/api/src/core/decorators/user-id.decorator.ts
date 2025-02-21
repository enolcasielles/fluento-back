import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    const userId = request.headers['user-id'];

    if (!userId) {
      throw new Error('UserId not found in request headers');
    }

    return userId;
  },
); 