import { Difficulty } from '@repo/core';

export class SavedListResponse {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  difficulty: Difficulty;
  difficultyLabel: string;
  totalUnits: number;
}

export class GetSavedListsResponse {
  lists: SavedListResponse[];
} 