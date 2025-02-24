import { CreationStatus, Difficulty } from '@repo/core';

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