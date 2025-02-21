import { Difficulty } from '@/core/enums/difficulty.enum';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateListRequest {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  topic: string;

  @IsEnum(Difficulty)
  difficulty: Difficulty;

  @IsString()
  @IsNotEmpty()
  grammarStructures: string;
} 