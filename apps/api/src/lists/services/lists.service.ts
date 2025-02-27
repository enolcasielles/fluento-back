import { Injectable, Inject } from '@nestjs/common';
import { PrismaClient } from '@repo/database';
import { ENGINE_PROVIDER, PRISMA_PROVIDER } from '@/core/modules/core.module';
import { CreateListRequest } from '../requests/create-list.request';
import { CreateListResponse } from '../responses/create-list.response';
import { GetListDetailResponse } from '../responses/get-list-detail.response';
import { GetListSessionResponse } from '../responses/get-list-session.response';
import { GetMyListsResponse } from '../responses/get-my-lists.response';
import { GetSavedListsResponse } from '../responses/get-saved-lists.response';
import { CustomException } from '@/core/exceptions/custom.exception';
import { Difficulty, DifficultyLabels, CreationStatus, CreationStatusLabels } from '@repo/core';
import { produceMessage } from '@repo/kafka';
import { CreateListMessage, Topics } from '@repo/core';
import { IEngineDI } from '@/core/di/engine.di';


@Injectable()
export class ListsService {
  constructor(
    @Inject(PRISMA_PROVIDER) private prisma: PrismaClient,
    @Inject(ENGINE_PROVIDER) private engineService: IEngineDI,
  ) {}

  async createList(userId: string, request: CreateListRequest): Promise<CreateListResponse> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { subscriptions: true },
    });

    const isPremium = user.subscriptions.some(
      (subscription) => subscription.status === 'active',
    );

    if (!isPremium) {
      throw new CustomException({
        message: 'Necesitas ser usuario Premium para crear listas',
        type: 'NEED_PREMIUM',
        statusCode: 403,
      });
    }

    const list = await this.prisma.list.create({
      data: {
        name: request.name,
        difficulty: request.difficulty,
        topic: request.topic,
        grammarStructures: request.grammarStructures,
        creationStatus: CreationStatus.PENDING,
        isPublic: false,
        creatorId: user.id,
      },
    });

    await produceMessage<CreateListMessage>({
      topic: Topics.CREATE_LIST,
      message: {
        listId: list.id,
        userId,
      }
    })

    return {
      id: list.id,
      name: list.name,
      topic: list.topic,
      grammarStructures: list.grammarStructures,
      difficulty: list.difficulty as Difficulty,
      difficultyLabel: DifficultyLabels[list.difficulty],
      creationStatus: list.creationStatus as CreationStatus,
      creationStatusLabel: CreationStatusLabels[list.creationStatus],
    };
  }

  async getMyLists(userId: string): Promise<GetMyListsResponse> {
    const lists = await this.prisma.list.findMany({
      where: {
        creatorId: userId,
      },
    });

    return {
      lists: lists.map((list) => ({
        id: list.id,
        name: list.name,
        description: list.description || '',
        imageUrl: list.imageUrl || '',
        difficulty: list.difficulty as Difficulty,
        difficultyLabel: DifficultyLabels[list.difficulty],
        totalUnits: list.totalUnits,
        creationStatus: list.creationStatus as CreationStatus,
        creationStatusLabel: CreationStatusLabels[list.creationStatus],
      })),
    };
  }

  async getSavedLists(userId: string): Promise<GetSavedListsResponse> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        savedLists: true,
      },
    });

    return {
      lists: user.savedLists.map((list) => ({
        id: list.id,
        name: list.name,
        description: list.description || '',
        imageUrl: list.imageUrl || '',
        difficulty: list.difficulty as Difficulty,
        difficultyLabel: DifficultyLabels[list.difficulty],
        totalUnits: list.totalUnits,
      })),
    };
  }

  async getListDetail(listId: string, userId: string): Promise<GetListDetailResponse> {
    const list = await this.prisma.list.findUnique({
      where: { id: listId },
      include: {
        creator: {
          include: {
            subscriptions: true,
          },
        },
      },
    });

    if (!list) {
      throw new CustomException({
        message: 'La lista no existe',
        statusCode: 404,
      });
    }

    if (!list.isPublic && list.creatorId !== userId) {
      throw new CustomException({
        message: 'No tienes permiso para ver esta lista',
        statusCode: 403,
      });
    }

    const session = await this.prisma.session.findFirst({
      where: {
        listId,
        userId,
      },
      include: {
        results: {
          include: {
            unit: true,
          },
        },
      },
    });

    const savedList = await this.prisma.list.findFirst({
      where: {
        id: listId,
        savedBy: {
          some: {
            id: userId,
          },
        },
      },
    });

    const bestResults = session?.results.reduce(
      (acc, result) => {
        if (!acc[result.unit.id] || acc[result.unit.id].score < result.score) {
          acc[result.unit.id] = result;
        }
        return acc;
      },
      {} as Record<string, typeof session.results[0]>,
    );

    const uniqueBestResults = bestResults ? Object.values(bestResults) : [];

    const userProgress = uniqueBestResults.length === 0
      ? null
      : {
          practicedUnits: uniqueBestResults.length,
          passedUnits: uniqueBestResults.filter((result) => result.score >= 3).length,
          averageScore:
            uniqueBestResults.reduce((acc, result) => acc + result.score, 0) /
            uniqueBestResults.length,
        };

    return {
      id: list.id,
      name: list.name,
      description: list.description || '',
      imageUrl: list.imageUrl || '',
      difficulty: list.difficulty as Difficulty,
      difficultyLabel: DifficultyLabels[list.difficulty],
      topic: list.topic,
      grammarStructures: list.grammarStructures,
      totalUnits: list.totalUnits,
      isSaved: !!savedList,
      creationStatus: list.creationStatus as CreationStatus,
      creationStatusLabel: CreationStatusLabels[list.creationStatus],
      userProgress,
    };
  }

  async getListSession(listId: string, userId: string): Promise<GetListSessionResponse> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscriptions: true,
      },
    });

    const list = await this.prisma.list.findUnique({
      where: { id: listId },
    });

    if (!list) {
      throw new CustomException({
        message: 'La lista no existe',
        statusCode: 404,
      });
    }

    const isPremium = user.subscriptions.some(
      (subscription) => subscription.status === 'active',
    );

    let session = await this.prisma.session.findFirst({
      where: {
        listId,
        userId,
      },
    });

    if (!session) {
      session = await this.prisma.session.create({
        data: {
          listId,
          userId,
        },
      });
    }

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
      units: sessionWithUnits.list.units
    });

    return {
      sessionId: session.id,
      listId: list.id,
      listName: list.name,
      evaluationMode: isPremium ? 'auto' : 'manual',
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

  async saveList(params: { listId: string; userId: string }): Promise<void> {
    const { listId, userId } = params;
    const list = await this.prisma.list.findUnique({
      where: { id: listId },
    });

    if (!list) {
      throw new CustomException({
        message: 'La lista que intentas guardar no existe',
        statusCode: 404,
      });
    }

    if (!list.isPublic && list.creatorId !== userId) {
      throw new CustomException({
        message: 'No tienes permisos para guardar esta lista',
        statusCode: 403,
      });
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        savedLists: {
          where: { id: listId },
        },
      },
    });

    if (user.savedLists.length > 0) {
      throw new CustomException({
        message: 'Ya tienes guardada esta lista',
        statusCode: 400,
      });
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        savedLists: {
          connect: { id: listId },
        },
      },
    });
  }

  async deleteSavedList(listId: string, userId: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        savedLists: {
          where: { id: listId },
        },
      },
    });

    if (user.savedLists.length === 0) {
      throw new CustomException({
        message: 'La lista no está guardada',
        statusCode: 404,
      });
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        savedLists: {
          disconnect: { id: listId },
        },
      },
    });
  }
} 