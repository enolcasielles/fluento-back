import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class SubmitResultRequest {
  @IsInt()
  @Min(1, { message: 'La puntuación debe ser al menos 1' })
  @Max(3, { message: 'La puntuación no puede ser mayor a 3' })
  score: number;

  @IsString()
  @IsOptional()
  answer?: string;
} 