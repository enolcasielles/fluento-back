import { CreationStatus } from '@/core/enums/creation-status.enum';
import { Difficulty } from '@/core/enums/difficulty.enum';

export class CreateListResponse {
  id: string;
  name: string;
  topic: string;
  grammarStructures: string;
  difficulty: Difficulty;
  difficultyLabel: string;
  creationStatus: CreationStatus;
  creationStatusLabel: string;
} 