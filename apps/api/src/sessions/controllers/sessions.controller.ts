import { Body, Controller, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SessionsService } from '../services/sessions.service';
import { Roles } from '@/auth/roles.decorator';
import { Role } from '@/core/enums/roles.enum';
import { UserId } from '@/core/decorators/user-id.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { SubmitResultRequest } from '../requests/submit-result.request';
import { EvaluateAnswerResponse } from '../responses/evaluate-answer.response';
import { SubmitResultResponse } from '../responses/submit-result.response';

@Controller('sessions')
@ApiTags('Sessions')
export class SessionsController {
  constructor(private sessionsService: SessionsService) {}

  @Post(':sessionId/units/:unitId/evaluate')
  @Roles([Role.User])
  @UseInterceptors(FileInterceptor('audio'))
  async evaluateAnswer(
    @Param('sessionId') sessionId: string,
    @Param('unitId') unitId: string,
    @UserId() userId: string,
    @UploadedFile() audioFile: File,
  ): Promise<EvaluateAnswerResponse> {
    return await this.sessionsService.evaluateAnswer(sessionId, unitId, userId, audioFile);
  }

  @Post(':sessionId/units/:unitId/result')
  @Roles([Role.User])
  async submitResult(
    @Param('sessionId') sessionId: string,
    @Param('unitId') unitId: string,
    @UserId() userId: string,
    @Body() request: SubmitResultRequest,
  ): Promise<SubmitResultResponse> {
    return await this.sessionsService.submitResult(sessionId, unitId, userId, request);
  }
} 