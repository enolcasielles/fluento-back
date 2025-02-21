import { CreationStatus } from '@/core/enums/creation-status.enum';
import { Difficulty } from '@/core/enums/difficulty.enum';

export class UserProgressResponse {
  practicedUnits: number;
  passedUnits: number;
  averageScore: number;
}

export class GetListDetailResponse {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  difficulty: Difficulty;
  difficultyLabel: string;
  topic: string;
  grammarStructures: string;
  totalUnits: number;
  isSaved: boolean;
  creationStatus: CreationStatus;
  creationStatusLabel: string;
  userProgress: UserProgressResponse;
} 