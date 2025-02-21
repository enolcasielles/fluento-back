import { ArgumentsHost, BadRequestException, Catch, HttpException, HttpStatus } from "@nestjs/common";

import { ExceptionFilter } from "@nestjs/common";
import { CustomException, GENERIC_EXCEPTION_TYPE } from "../exceptions/custom.exception";

interface CustomErrorResponse {
  type: string;
  statusCode: number;
	timestamp: number;
  message: string;
}

@Catch()
export class ErrorsFilter implements ExceptionFilter {
  catch(error: Error, host: ArgumentsHost) {
    const genericError = 'Internal Server Error';
    const response = host.switchToHttp().getResponse();
    let errorResponse: CustomErrorResponse;

    if (error instanceof BadRequestException) {
      const response = <any>error.getResponse();
      const status = error.getStatus();
      const errorList = new Set<string>();

      if (typeof response.message === 'object') {
        for (const message of response.message) {
          errorList.add(message);
        }
      } else if (typeof response.message === 'string') {
        errorList.add(response.message);
      }

      errorResponse = {
        statusCode: status,
        message: errorList.size > 0 ? Array.from(errorList).join(', ') : genericError,
        timestamp: new Date().getTime(),
        type: 'BAD_REQUEST_ERROR',
      } as CustomErrorResponse;
    } else if (error instanceof CustomException) {
      const errorMessage = error.message;
      const status = error.getStatus();

      errorResponse = {
        statusCode: status,
        message: errorMessage ?? genericError,
        timestamp: new Date().getTime(),
        type: error.type,
      } as CustomErrorResponse;
    } else if (error instanceof HttpException) {
      const errorMessage = error.message;
      const status = error.getStatus();

      errorResponse = {
        statusCode: status,
        message: errorMessage ?? genericError,
        timestamp: new Date().getTime(),
      } as CustomErrorResponse;
    }
    else {
      errorResponse = {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: genericError,
        timestamp: new Date().getTime(),
        type: 'GENERIC_ERROR',
      } as CustomErrorResponse;
    }

    response.status(errorResponse.statusCode).send(errorResponse);
  }
}
