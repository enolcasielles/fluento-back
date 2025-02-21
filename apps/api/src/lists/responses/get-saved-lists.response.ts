import { Difficulty } from '@/core/enums/difficulty.enum';

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