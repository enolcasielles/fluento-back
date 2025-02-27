import { Injectable, Inject } from '@nestjs/common';
import { PrismaClient } from '@repo/database';
import { ENGINE_PROVIDER, PRISMA_PROVIDER } from '@/core/modules/core.module';
import { CustomException } from '@/core/exceptions/custom.exception';
import { SubmitResultRequest } from '../requests/submit-result.request';
import { SubmitResultResponse } from '../responses/submit-result.response';
import { EvaluateAnswerResponse } from '../responses/evaluate-answer.response';
import { NO_ANSWER } from '@/core/constants/constants';
import { IEngineDI } from '@/core/di/engine.di';

@Injectable()
export class SessionsService {
  constructor(
    @Inject(PRISMA_PROVIDER) private prisma: PrismaClient,
    @Inject(ENGINE_PROVIDER) private engineService: IEngineDI,
  ) {}

  async evaluateAnswer(
    sessionId: string,
    unitId: string,
    userId: string,
    audioFile: File,
  ): Promise<EvaluateAnswerResponse> {
    const session = await this.prisma.session.findUnique({
      where: {
        id: sessionId,
        userId: userId,
      },
      include: {
        list: {
          include: {
            units: {
              where: {
                id: unitId,
              },
            },
          },
        },
      },
    });

    if (!session) {
      throw new CustomException({
        message: 'Sesión no encontrada',
        statusCode: 404,
      });
    }

    const unit = session.list.units.find((unit) => unit.id === unitId);

    if (!unit) {
      throw new CustomException({
        message: 'La unidad no pertenece a la lista de la sesión',
        statusCode: 404,
      });
    }

    const transcription = await this.engineService.audioToText(audioFile);
    const score = await this.engineService.evaluateAnswer(unit.answerText, transcription);

    return { score, answer: transcription };
  }

  async submitResult(
    sessionId: string,
    unitId: string,
    userId: string,
    request: SubmitResultRequest,
  ): Promise<SubmitResultResponse> {
    const session = await this.prisma.session.findUnique({
      where: {
        id: sessionId,
        userId: userId,
      },
      include: {
        list: {
          include: {
            units: {
              where: {
                id: unitId,
              },
            },
          },
        },
      },
    });

    if (!session) {
      throw new CustomException({
        message: 'Sesión no encontrada',
        statusCode: 404,
      });
    }

    const unit = session.list.units.find((unit) => unit.id === unitId);

    if (!unit) {
      throw new CustomException({
        message: 'La unidad no pertenece a la lista de la sesión',
        statusCode: 404,
      });
    }

    await this.prisma.result.create({
      data: {
        score: request.score,
        answer: request.answer ?? NO_ANSWER,
        session: {
          connect: { id: sessionId },
        },
        unit: {
          connect: { id: unitId },
        },
        user: {
          connect: { id: userId },
        },
      },
    });


    const sessionWithUnits = await this.prisma.session.findUnique({
      where: { id: session.id },
      include: {
        list: {
          include: {
            units: {
              include: {
                results: {
                  orderBy: {
                    createdAt: 'desc',
                  },
                },
              },
            },
          },
        },
      },
    });
    const nextUnit = await this.engineService.generateNextUnit({
      units: sessionWithUnits.list.units,
    });

    return {
      nextUnit: {
        id: nextUnit.id,
        question: {
          text: nextUnit.questionText,
          audio: nextUnit.questionAudio,
        },
        answer: {
          text: nextUnit.answerText,
          audio: nextUnit.answerAudio,
        },
        responseTime: nextUnit.responseTime,
      },
    };
  }
} 