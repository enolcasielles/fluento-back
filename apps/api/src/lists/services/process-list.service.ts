import { Injectable, Inject } from '@nestjs/common';
import { List, PrismaClient } from '@repo/database';
import { PRISMA_PROVIDER } from '@/core/modules/core.module';
import { CustomException } from '@/core/exceptions/custom.exception';
import { CreationStatus } from '@/core/enums/creation-status.enum';
import { Difficulty } from '@/core/enums/difficulty.enum';
import { EngineService } from '@/core/services/engine.service';

@Injectable()
export class ProcessListService {
  constructor(
    @Inject(PRISMA_PROVIDER) private prisma: PrismaClient,
    private engineService: EngineService,
  ) {}

  async processList(listId: string, userId: string): Promise<List> {
    try {
      const list = await this.prisma.list.findUnique({
        where: { id: listId, creatorId: userId },
        include: {
          units: true,
        },
      });

      if (!list) {
        throw new CustomException({
          message: 'Lista no encontrada',
        });
      }

      if (list.units.length > 0) {
        throw new CustomException({
          message: 'La lista ya tiene unidades',
        });
      }

      await this.prisma.list.update({
        where: { id: listId },
        data: {
          creationStatus: CreationStatus.IN_PROGRESS,
        },
      });

      if (!list.imageUrl) {
        try {
          const imageUrl = await this.engineService.generateListImage({
            topic: list.topic,
          });
          await this.prisma.list.update({
            where: { id: listId },
            data: {
              imageUrl,
            },
          });
        } catch (error) {}
      }

      try {
        const { units, description } = await this.engineService.generateList({
          difficulty: list.difficulty as Difficulty,
          topic: list.topic,
          grammarStructures: list.grammarStructures,
          numberOfUnits: 10,
        });

        const unitsToCreate: Array<{
          questionText: string;
          questionAudio: string;
          answerText: string;
          answerAudio: string;
        }> = [];

        for (const unit of units) {
          unitsToCreate.push({
            questionText: unit.questionText,
            questionAudio: null,
            answerText: unit.answerText,
            answerAudio: null,
          });
        }

        await this.prisma.unit.createMany({
          data: unitsToCreate.map((unit) => ({
            ...unit,
            listId,
            responseTime: this.engineService.calculateResponseTime({
              answerText: unit.answerText,
              difficulty: list.difficulty as Difficulty,
            }),
          })),
        });

        const updatedList = await this.prisma.list.update({
          where: { id: listId },
          data: {
            creationStatus: CreationStatus.COMPLETED,
            description,
            totalUnits: unitsToCreate.length,
          },
        });

        return updatedList;
      } catch (error) {
        await this.prisma.list.update({
          where: { id: listId },
          data: {
            creationStatus: CreationStatus.FAILED,
          },
        });
        throw new CustomException({
          message:
            'Se ha producido un error al ejecutar los LLMs para generar las unidades',
        });
      }
    } catch (error) {
      if (error instanceof CustomException) {
        throw error;
      }
      throw new CustomException({
        message: 'Error al generar las unidades',
      });
    }
  }
}
