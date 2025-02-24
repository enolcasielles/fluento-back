import { Injectable, Inject } from '@nestjs/common';
import { PrismaClient } from '@repo/database';
import { GetExploreResponse } from '../responses/get-explore.response';
import { Difficulty } from '@repo/core';
import { PRISMA_PROVIDER } from '@/core/modules/core.module';

@Injectable()
export class ExploreService {
  constructor(
    @Inject(PRISMA_PROVIDER) private prisma: PrismaClient,
  ) {}

  async getExplore(): Promise<GetExploreResponse> {
    const categories = await this.prisma.category.findMany({
      include: {
        lists: {
          where: {
            isPublic: true,
            creationStatus: 'COMPLETED',
          },
          select: {
            id: true,
            name: true,
            description: true,
            imageUrl: true,
            difficulty: true,
            totalUnits: true,
          },
        },
      },
    });

    return {
      categories: categories.map((category) => ({
        id: category.id,
        name: category.name,
        lists: category.lists.map((list) => ({
          id: list.id,
          name: list.name,
          description: list.description || '',
          imageUrl: list.imageUrl || '',
          difficulty: list.difficulty as Difficulty,
          totalUnits: list.totalUnits,
        })),
      })),
    };
  }
} 