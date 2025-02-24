import { Difficulty } from "@repo/core";

export class ListResponse {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  difficulty: Difficulty;
  totalUnits: number;
}

export class CategoryResponse {
  id: string;
  name: string;
  lists: ListResponse[];
}

export class GetExploreResponse {
  categories: CategoryResponse[];
} 