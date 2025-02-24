import { CreationStatus , Difficulty } from '@repo/core';

export class ListResponse {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  difficulty: Difficulty;
  difficultyLabel: string;
  totalUnits: number;
  creationStatus: CreationStatus;
  creationStatusLabel: string;
}

export class GetMyListsResponse {
  lists: ListResponse[];
} 