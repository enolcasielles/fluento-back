import {
  NestInterceptor,
  ExecutionContext,
  Injectable,
  CallHandler,
} from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { map, Observable } from 'rxjs';

@Injectable()
export class ResponsesInterceptor implements NestInterceptor {
  intercept(
    _context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data) => {
        try {
          return instanceToPlain(data);
        } catch (e) {
          return data;
        }
      }),
    );
  }
}
