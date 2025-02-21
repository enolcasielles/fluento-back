/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	BadRequestException,
	CallHandler,
	ExecutionContext,
	HttpStatus,
	Inject,
	Injectable,
	NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CustomException } from '../exceptions/custom.exception';

interface CustomErrorResponse {
  type: string;
  statusCode: number;
	timestamp: number;
  message: string;
}

@Injectable()
export class ExceptionInterceptor implements NestInterceptor {
	intercept(
		context: ExecutionContext,
		next: CallHandler,
	): Observable<CustomErrorResponse> {
		return next.handle().pipe(
			catchError(async (error) => {
				const genericError = 'Internal Server Error';
				console.error('error', error);
				if (error instanceof BadRequestException) {
					const response = <any>error.getResponse();
					const status = error.getStatus();

					context.switchToHttp().getResponse().status(status);

					const errorList = new Set<string>();
					if (typeof response.message === 'object') {
						for (const message of response.message) {
							errorList.add(message);
						}
					} else if (typeof response.message === 'string') {
						errorList.add(response.message);
					}

					return {
						statusCode: status,
						message: errorList.size > 0 ? Array.from(errorList).join(', ') : genericError,
						timestamp: new Date().getTime(),
						type: 'BAD_REQUEST_ERROR',
					} as CustomErrorResponse;
				} else if (error instanceof CustomException) {
					const response = <string>error.getResponse();
					const status = error.getStatus();

					context.switchToHttp().getResponse().status(status);

					return {
						statusCode: status,
						message: response ?? genericError,
						timestamp: new Date().getTime(),
						type: error.type,
					} as CustomErrorResponse;
				} else {
					context.switchToHttp().getResponse().status(500);
					return {
						statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
						message: genericError,
						timestamp: new Date().getTime(),
						type: 'GENERIC_ERROR',
					};
				}
			}),
		);
	}
}
